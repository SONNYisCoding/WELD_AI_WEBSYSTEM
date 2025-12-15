import os
import json
import cv2
import numpy as np
from skimage.morphology import skeletonize
from config import OUTPUT_DIR


def extract_track(
    mask_path: str,
    job_id: str,
    num_samples: int = 200,
):
    """
    Extract weld centerline (track) from segmentation mask.

    This implementation:
    - Preserves original skeleton.py structure
    - Integrates ALL data-processing logic from skeleton - Copyy.py
    - Uses PCA-based centerline extraction (robot-welding grade)
    - Fixes zig-zag / "lông nhím" issue via PCA-axis binning

    Parameters
    ----------
    mask_path : str
        Path to binary segmentation mask image.
    job_id : str
        Job identifier.
    num_samples : int
        Number of bins / sampled points along weld seam.
    """

    # ============================================================
    # 0. Resolve output paths
    # ============================================================
    output_dir = OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)

    skeleton_path = os.path.join(output_dir, f"{job_id}_skeleton.png")
    track_path = os.path.join(output_dir, f"{job_id}_track.png")
    bbox_path = os.path.join(output_dir, f"{job_id}_bbox.json")
    bg_path = os.path.join(output_dir, f"{job_id}_annotated.png")

    # ============================================================
    # 1. Load mask & skeletonize
    # ============================================================
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    if mask is None:
        raise RuntimeError(f"Cannot read mask file: {mask_path}")

    # Convert to binary mask
    bw = mask > 0

    # Skeletonize binary mask
    skel = skeletonize(bw).astype("uint8") * 255

    # Save skeleton image
    cv2.imwrite(skeleton_path, skel)

    # Safety: ensure skeleton is 2D
    if skel.ndim == 3:
        skel = skel[:, :, 0]

    # ============================================================
    # 2. Extract skeleton points
    # ============================================================
    ys, xs = np.where(skel > 0)

    # Not enough points → cannot form a centerline
    if len(xs) < 2:
        # Fallback: copy background image if exists
        if os.path.exists(bg_path):
            img = cv2.imread(bg_path)
            cv2.imwrite(track_path, img)
        return skeleton_path

    # Skeleton points in ROI coordinates (x, y)
    pts_roi = np.vstack((xs, ys)).T.astype(float)

    # ============================================================
    # 3. PCA: find principal axis of weld seam
    # ============================================================
    # Center the data
    mean = pts_roi.mean(axis=0)
    pts_centered = pts_roi - mean

    # PCA via SVD (no sklearn dependency)
    _, _, vh = np.linalg.svd(pts_centered, full_matrices=False)

    # Principal direction (unit vector)
    direction = vh[0]

    # Project each skeleton point onto PCA axis
    t = pts_centered @ direction

    # ============================================================
    # 4. PCA-AXIS BINNING (CRITICAL FIX)
    # ============================================================
    # Instead of connecting raw skeleton points (causes zig-zag),
    # we:
    #   - divide PCA axis into bins
    #   - compute mean (x, y) per bin
    #   - obtain ONE center point per bin

    t_min, t_max = t.min(), t.max()
    bins = np.linspace(t_min, t_max, num_samples)

    centerline_pts = []

    for i in range(len(bins) - 1):
        mask_bin = (t >= bins[i]) & (t < bins[i + 1])
        if not np.any(mask_bin):
            continue

        # Mean point in this bin = true centerline point
        center_pt = pts_roi[mask_bin].mean(axis=0)
        centerline_pts.append(center_pt)

    if len(centerline_pts) < 2:
        # Fallback if binning fails
        samples_roi = pts_roi
    else:
        samples_roi = np.array(centerline_pts)

    # ============================================================
    # 5. Map ROI points back to full image coordinates
    # ============================================================
    if os.path.exists(bbox_path):
        with open(bbox_path, "r") as f:
            bbox = json.load(f).get("bbox", [0, 0, 0, 0])

        x1, y1 = bbox[0], bbox[1]
        samples_img = samples_roi + np.array([x1, y1])
    else:
        samples_img = samples_roi

    # ============================================================
    # 6. Draw centerline track on background image
    # ============================================================
    if os.path.exists(bg_path):
        img = cv2.imread(bg_path)

        # Draw polyline (centerline)
        track_pts = samples_img.astype(np.int32).reshape((-1, 1, 2))
        cv2.polylines(
            img,
            [track_pts],
            isClosed=False,
            color=(0, 0, 255),
            thickness=2,
        )

        # Draw sampled points (debug visualization)
        for pt in samples_img.astype(int):
            cv2.circle(img, tuple(pt), 2, (255, 0, 0), -1)

        cv2.imwrite(track_path, img)

    return skeleton_path