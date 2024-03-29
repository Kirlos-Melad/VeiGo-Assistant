#!/bin/bash

# Directory where the weights should be
WEIGHTS_DIR="./weights"
# Name of the weights file to check
WEIGHTS_FILE="phi-2.Q4_K_M.gguf"
# Url of the weights file to download
WEIGHTS_URL="https://huggingface.co/TheBloke/phi-2-GGUF/resolve/main/phi-2.Q4_K_M.gguf"

# Check if the weights file exists in the directory
if [ ! -f "${WEIGHTS_DIR}/${WEIGHTS_FILE}" ]; then
    echo "Model weights file ${WEIGHTS_FILE} not found. Downloading..."
    # Create the directory if it doesn't exist
    mkdir -p $WEIGHTS_DIR
    # Download the weights. Replace YOUR_DOWNLOAD_URL_HERE with your actual download URL
    wget -P $WEIGHTS_DIR $WEIGHTS_URL
else
    echo "Model weights file ${WEIGHTS_FILE} found. Skipping download."
fi