# syntax=docker/dockerfile:1
FROM python:3.11-slim

# System deps: ffmpeg for audio, build tools for TTS wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV TOS_AGREED=1

WORKDIR /app

# Install Python deps (cached layer — only rebuilds when requirements.txt changes)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Bake the XTTS v2 model into the image (~2 GB) so runtime startup is instant
RUN echo "y" | python -c "from TTS.api import TTS; TTS('tts_models/multilingual/multi-dataset/xtts_v2')"

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
