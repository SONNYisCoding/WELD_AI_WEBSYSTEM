import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PIPELINE_DIR = os.path.join(BASE_DIR, "pipeline")
MODEL_DIR = os.path.join(BASE_DIR, "models")
STORAGE_DIR = os.path.join(BASE_DIR, "storage")

UPLOAD_DIR = os.path.join(STORAGE_DIR, "uploads")
OUTPUT_DIR = os.path.join(STORAGE_DIR, "outputs")

# Flask
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB

# ============================
# REDIS (NEW)
# ============================
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
USE_QUEUE = os.getenv("USE_QUEUE", "false").lower() == "true"