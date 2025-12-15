import os
import json
import cv2
import numpy as np
import onnxruntime as ort
from config import MODEL_DIR, OUTPUT_DIR

MODEL_PATH = os.path.join(MODEL_DIR, "yolov8s-weld-new.onnx")
IMG_SIZE = 512
CONF_THRES = 0.25

# Load model once at module level
session = ort.InferenceSession(
    MODEL_PATH, providers=["CPUExecutionProvider"]
)

# --------------------------------------------------
# Preprocess
# --------------------------------------------------
def preprocess(img):
    h, w = img.shape[:2]
    img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
    img_norm = img_rgb.astype(np.float32) / 255.0
    img_chw = np.transpose(img_norm, (2, 0, 1))
    input_tensor = np.expand_dims(img_chw, axis=0)
    return input_tensor, (h, w)


# --------------------------------------------------
# Postprocess (YOLOv8 ONNX)
# --------------------------------------------------
def postprocess(output, orig_shape):
    """
    output: (1, 84, 8400)
    """
    preds = output[0].T  # (8400, 84)

    best_conf = 0.0
    best_bbox = None

    for pred in preds:
        x, y, w, h = pred[:4]
        class_scores = pred[4:]

        class_id = np.argmax(class_scores)
        conf = class_scores[class_id]

        if conf < CONF_THRES:
            continue

        if conf > best_conf:
            best_conf = conf
            best_bbox = (x, y, w, h)

    if best_bbox is None:
        return None

    # Convert to xyxy (normalized)
    x, y, w, h = best_bbox
    x1 = x - w / 2
    y1 = y - h / 2
    x2 = x + w / 2
    y2 = y + h / 2

    oh, ow = orig_shape
    return [
        int(x1 / IMG_SIZE * ow),
        int(y1 / IMG_SIZE * oh),
        int(x2 / IMG_SIZE * ow),
        int(y2 / IMG_SIZE * oh),
    ]


# --------------------------------------------------
# Main
# --------------------------------------------------
def detect_roi(image_path: str, job_id: str) -> str:
    img = cv2.imread(image_path)
    if img is None:
        raise RuntimeError("Cannot read input image")

    input_tensor, orig_shape = preprocess(img)

    input_name = session.get_inputs()[0].name
    output = session.run(None, {input_name: input_tensor})[0]

    bbox = postprocess(output, orig_shape)

    roi_path = os.path.join(OUTPUT_DIR, f"{job_id}_roi.png")
    annotated_path = os.path.join(OUTPUT_DIR, f"{job_id}_annotated.png")
    bbox_path = os.path.join(OUTPUT_DIR, f"{job_id}_bbox.json")

    if bbox is None:
        cv2.imwrite(roi_path, img)
        return roi_path

    x1, y1, x2, y2 = bbox
    h, w = img.shape[:2]
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(w, x2), min(h, y2)

    roi = img[y1:y2, x1:x2]
    if roi.size == 0:
        cv2.imwrite(roi_path, img)
        return roi_path

    cv2.imwrite(roi_path, roi)

    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.imwrite(annotated_path, img)

    with open(bbox_path, "w") as f:
        json.dump({"bbox": [x1, y1, x2, y2]}, f)

    return roi_path