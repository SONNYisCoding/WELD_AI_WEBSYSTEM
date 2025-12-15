import uuid
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from config import UPLOAD_DIR, OUTPUT_DIR, MAX_CONTENT_LENGTH, USE_QUEUE, REDIS_URL
from pipeline.run_yolo_detect import detect_roi
from pipeline.run_unet_or_fallback import segment_roi
from pipeline.skeleton import extract_track
from rq import Queue
from redis import Redis
from worker import run_pipeline

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

if USE_QUEUE:
    from rq import Queue
    from redis import Redis
    from worker import run_pipeline

    redis_conn = Redis.from_url(REDIS_URL)
    queue = Queue("ai-jobs", connection=redis_conn)


@app.route("/api/process", methods=["POST"])
def process():
    if "file" not in request.files:
        return {"error": "no file"}, 400

    f = request.files["file"]
    job_id = uuid.uuid4().hex

    input_path = os.path.join(UPLOAD_DIR, f"{job_id}.jpg")
    f.save(input_path)

    if USE_QUEUE:
        queue.enqueue(
            run_pipeline,
            input_path,
            job_id,
            job_timeout=300
        )
    else:
        roi = detect_roi(input_path, job_id)
        mask = segment_roi(roi, job_id)
        extract_track(mask, job_id)


    return jsonify({
        "job_id": job_id,
        "images": {
            "roi": f"/api/image/{job_id}_roi.png",
            "mask": f"/api/image/{job_id}_mask.png",
            "skeleton": f"/api/image/{job_id}_skeleton.png",
            "track": f"/api/image/{job_id}_track.png",
        }
    })

@app.route("/api/image/<path:filename>")
def serve_image(filename):
    return send_from_directory(OUTPUT_DIR, filename)

@app.route("/", methods=["GET"])
def index():
    return {
        "service": "weld-backend-api",
        "status": "running"
    }, 200


@app.route("/health", methods=["GET"])
def health_check():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

