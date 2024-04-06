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

# Install depencencies
RUN python3 -m pip install --upgrade pip pytest cmake scikit-build setuptools fastapi uvicorn sse-starlette pydantic-settings starlette-context


# Install the requirements
COPY ./requirements.txt .
RUN python3 -m pip install -r requirements.txt


COPY . .
# Make the script executable and run it
RUN chmod +x ./scripts/download_model.sh && \
    ./scripts/download_model.sh


# Run the server
CMD python3 server.py