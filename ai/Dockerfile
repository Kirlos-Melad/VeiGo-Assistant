FROM nvidia/cuda:12.2.2-devel-ubuntu22.04

# Set the working directory
WORKDIR /app

# Set environment variables
ENV CMAKE_ARGS -DLLAMA_CUBLAS=on
ENV FORCE_CMAKE 1
ENV CUDA_DOCKER_ARCH=all
ENV LLAMA_CUBLAS=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3.10 \
    python3-pip

# Install the requirements
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Make the script executable and run it
RUN chmod +x ./scripts/download_model.sh && \
    ./scripts/download_model.sh

# Run the server
CMD python3 server.py


