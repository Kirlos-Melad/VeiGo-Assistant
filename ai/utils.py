import json
import os

def _load_options():
    with open('./configs/phi2.json', 'r') as file:
        options = json.load(file)
    return options

def set_enviromental_variables():
    os.environ['MODEL_NAME'] = 'model.gguf'
    os.environ['SERVER_PORT'] = '5000'
    
    
