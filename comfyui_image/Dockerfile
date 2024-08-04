FROM nvidia/cuda:12.5.1-cudnn-devel-ubuntu22.04

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    python3.11 \
    python3-pip \
    # ffmpeg
    ffmpeg

# Python Evn
RUN pip3 install torch==2.3.0 torchvision==0.18.0 torchaudio==2.3.0 --index-url https://download.pytorch.org/whl/cu121 packaging
RUN pip3 install \
    xformers==0.0.26.post1 \
    diffusers[torch]==0.28.2 transformers \
    flash-attn==2.5.9.post1 insightface==0.7.3 \
    pyOpenSSL watchdog onnxruntime-gpu \
    opencv-python==4.8.0.76 opencv-contrib-python==4.8.0.76 opencv-python-headless==4.10.0.84 \
    inference==0.15.1 inference-cli==0.15.1 inference-gpu==0.15.1

COPY ComfyUI /app/ComfyUI
RUN pip3 install -r /app/ComfyUI/requirements.txt

EXPOSE 8848
CMD ["python3", "-u", "/app/ComfyUI/main.py", "--multi-user", "--listen", "0.0.0.0", "--port", "8848"]