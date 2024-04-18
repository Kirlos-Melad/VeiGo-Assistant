import eventlet
import socketio
from models.chat_model import ChatModel

class ServerManger:
    def __init__(self, port: int, chat_model:ChatModel) -> None:
        self.port = port
        self.chat_model = chat_model
        self.sio = socketio.Server()
        self.app = socketio.WSGIApp(self.sio, static_files={'/': {'content_type': 'text/html', 'filename': 'index.html'}})

        # Define event handlers
        self.sio.on('connect', self.on_connect)
        self.sio.on('ask', self.on_ask)
        self.sio.on('disconnect', self.on_disconnect)

    def on_connect(self, sid: str, environ:str) -> None:
        print('connect ', sid)

    def on_ask(self, sid: str, question: str):
        #return dict{result, error} #* one of them has to be Null and the other has to be an object
        response =  self.chat_model.infer(question, limit=2000)
        if response.strip() == '':
            response = 'I am sorry, I could not understand that.'
        return response

    def on_disconnect(self, sid):
        print('disconnect ', sid)

    def start(self):
        eventlet.wsgi.server(eventlet.listen(('', self.port)), self.app)