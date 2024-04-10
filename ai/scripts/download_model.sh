#!/bin/bash

# Check if the weights file exists in the directory
if [ ! -f "${MODEL_PATH}/${MODEL_NAME}" ]; then
    echo "Model weights file ${MODEL_NAME} not found. Downloading..."
    # Create the directory if it doesn't exist
    mkdir -p $MODEL_PATH
    # Download the weights
    wget -P $MODEL_PATH -O ${MODEL_PATH}/${MODEL_NAME} $MODEL_URL
else
    echo "Model weights file ${MODEL_NAME} found. Skipping download."
fi