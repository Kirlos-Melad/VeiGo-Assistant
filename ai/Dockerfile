FROM nvidia/cuda:12.2.2-devel-ubuntu22.04

# Set the working directory
WORKDIR /app

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git build-essential \
    python3 python3-pip gcc wget \
    ocl-icd-opencl-dev opencl-headers clinfo \
    libclblast-dev libopenblas-dev \
    && mkdir -p /etc/OpenCL/vendors && echo "libnvidia-opencl.so.1" > /etc/OpenCL/vendors/nvidia.icd

RUN apt-get update && apt-get install -y wget
RUN apt-get -y update; apt-get -y install curl
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set environment variables
ENV CMAKE_ARGS -DLLAMA_CUBLAS=on
ENV FORCE_CMAKE 1
ENV CUDA_DOCKER_ARCH=all
ENV LLAMA_CUBLAS=1

# Install the depencencies
COPY ./requirements.txt .
RUN python3 -m pip install -r requirements.txt

COPY . .

# Expect Arg variables
ARG MODEL_URL
ARG MODEL_PATH
ARG MODEL_NAME

# Change the permissions of a file to make it executable.
RUN chmod +x ./scripts/download_model.sh && \
    ./scripts/download_model.sh

# Run the server
CMD python3 server.py