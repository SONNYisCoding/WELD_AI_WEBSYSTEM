import cv2
import os
from config import OUTPUT_DIR

def segment_roi(roi_path: str, job_id: str) -> str:
    img = cv2.imread(roi_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise RuntimeError("Cannot read ROI image")

    clahe = cv2.createCLAHE(2.0, (8,8))
    img = clahe.apply(img)

    _, mask = cv2.threshold(img, 200, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, 2)

    mask_path = os.path.join(OUTPUT_DIR, f"{job_id}_mask.png")
    cv2.imwrite(mask_path, mask)

    return mask_path
