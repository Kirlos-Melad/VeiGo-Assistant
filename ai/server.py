import eventlet
import socketio
from llama_cpp import Llama
from prompt import BIG_SYSTEM_PROMPT, CONCISE_SYSTEM_PROMPT

# SYSTEM_PROMPT = "You're helpful assistant, your name is Veigo Assistant and you're a discord bot powered by ai, you're created by Kirlos Melad and Andrew Naaem, and always answers truthfully-"
llm = Llama(
    model_path="./weights/phi-2.Q4_K_M.gguf",
    n_ctx=1024,
    n_threads=10,
    n_gpu_layers=15
)

sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={'/': {'content_type': 'text/html', 'filename': 'index.html'}})
#*increase the timeout to 10 seconds



def respond(data, prompt=CONCISE_SYSTEM_PROMPT):
    output = llm(
        f"Instruct: {prompt} {data}\nOutput:", # Prompt
        max_tokens=1024,  # Generate up to 512 tokens
        stop=["</s>"],   # Example stop token - not necessarily correct for this specific model! Please check before using.
        echo=False, # Whether to echo the prompt
        temperature=0.7, 
        top_p=0.95
        )
    
    return output['choices'][0]['text'].split('\nOutput: ')[-1]


@sio.event
def connect(sid, environ):
    print('connect ', sid)

@sio.event
def ask(sid, data):
    sio.emit('response', respond(data), room=sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

def start():
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)

if __name__ == '__main__':
    start()