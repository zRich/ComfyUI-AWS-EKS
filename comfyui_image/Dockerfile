FROM nvidia/cuda:12.5.1-cudnn-devel-ubuntu22.04

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    python3.11 \
    python3-pip \
    # ffmpeg
    ffmpeg

# Create a python virtual environment, path: /app, python version: 3.11.8
RUN python3 -m venv /app