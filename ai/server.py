import os
import eventlet
import socketio
import argparse
import utils as ut
from prompts.phi2 import SMALL_SYSTEM_PROMPT, PHI2_TEMPLATE
from dotenv import load_dotenv
load_dotenv('./docker-compose.env')


PORT = int(os.getenv('SERVER_PORT'))
MODEL_OPTIONS = ut._load_options()['options']
from models.ollama_model import OllamaModel
ai_model = OllamaModel(template=PHI2_TEMPLATE, system=SMALL_SYSTEM_PROMPT, options=MODEL_OPTIONS, show_logs=True)

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