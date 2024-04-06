#!/bin/bash

# Directory where the weights should be
WEIGHTS_DIR="weights"
MODEL_NAME=model.gguf
MODEL_URL=https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q2_K.gguf

# Check if the weights file exists in the directory
if [ ! -f "${WEIGHTS_DIR}/${MODEL_NAME}" ]; then
    echo "Model weights file ${MODEL_NAME} not found. Downloading..."
    # Create the directory if it doesn't exist
    mkdir -p $WEIGHTS_DIR
    # Download the weights
    wget -P $WEIGHTS_DIR -O ${WEIGHTS_DIR}/${MODEL_NAME} $MODEL_URL
else
    echo "Model weights file ${MODEL_NAME} found. Skipping download."
fi