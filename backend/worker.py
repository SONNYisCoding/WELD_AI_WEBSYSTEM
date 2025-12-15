from pipeline.run_yolo_detect import detect_roi
from pipeline.run_unet_or_fallback import segment_roi
from pipeline.skeleton import extract_track

def run_pipeline(image_path: str, job_id: str):
    roi_path = detect_roi(image_path, job_id)
    mask_path = segment_roi(roi_path, job_id)
    extract_track(mask_path, job_id)
