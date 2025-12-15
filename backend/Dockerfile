FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# system deps (opencv cần libglib)
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# QUAN TRỌNG: WORKDIR vào backend
WORKDIR /app/backend

# copy requirements riêng
COPY backend/requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# copy toàn bộ backend
COPY backend/ .

EXPOSE 5000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:$PORT", "--workers", "1", "--timeout", "300", "--preload", "False"]
#CMD ["python", "-u", "app.py"]
