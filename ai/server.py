import argparse
import json
import os

import eventlet
import socketio
from models.chat_model import ChatModel
from prompts.template import TEMPLATE


# Moved the settings loading into a function
def load_settings():
    with open('./configs/settings.json', 'r') as file:
        return json.load(file)

# Moved the system prompt loading into a function
def load_system_prompt(prompt_type):
    if prompt_type == 'small':
        from prompts.small_system_prompt import SMALL_SYSTEM_PROMPT
        return SMALL_SYSTEM_PROMPT
    elif prompt_type == 'medium':
        from prompts.medium_system_prompt import MEDIUM_SYSTEM_PROMPT
        return MEDIUM_SYSTEM_PROMPT
    elif prompt_type == 'large':
        from prompts.large_system_prompt import LARGE_SYSTEM_PROMPT
        return LARGE_SYSTEM_PROMPT
    else:
        raise ValueError(f"Invalid system prompt type: {prompt_type}")

settings = load_settings()
system_prompt = load_system_prompt(settings['system_prompt'])

PORT = int(os.getenv('SERVER_PORT'))
MODEL_OPTIONS = settings['options']

ai_model = ChatModel(template=TEMPLATE, system=system_prompt, options=MODEL_OPTIONS, show_logs=settings['show_logs'])
sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={'/': {'content_type': 'text/html', 'filename': 'index.html'}})

def respond(data):
    response =  ai_model.infer(data, limit=1000)
    if response.strip() == '':
        response = 'I am sorry, I could not understand that.'
    return response

@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def ask(sid, data):
    sio.emit('answer', respond(data), room=sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

def start():
    eventlet.wsgi.server(eventlet.listen(('', PORT)), app)

if __name__ == '__main__':
    start()