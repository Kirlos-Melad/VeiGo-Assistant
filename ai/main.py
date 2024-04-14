import json
import os
from models.chat_model import ChatModel
from prompts.template import TEMPLATE
from server_manger import ServerManger
from db.db_manager import DataBaseManager
from db.chat_entity import ChatEntity


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


def initalize_db():
    DEFAULT_DB_NAME = os.getenv("DEFAULT_DB_NAME")
    DB_NAME = os.getenv("DB_NAME")
    USER = os.getenv("DB_USER")
    PASSWORD = os.getenv("DB_PASSWORD")
    HOST = os.getenv("DB_HOST")
    POST = os.getenv("DB_PORT")

    defaulta_db = DataBaseManager(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=POST,
        name=DEFAULT_DB_NAME
    )
    defaulta_db.create_database(DB_NAME)
    chat_db = DataBaseManager(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=POST,
        name=DB_NAME
    )
    chat_db.connect()
    chat_db.create_tables([ChatEntity])


if __name__ == '__main__':
    settings = load_settings()
    system_prompt = load_system_prompt(settings['system_prompt'])
    initalize_db()

    PORT = int(os.getenv('SERVER_PORT'))
    MODEL_OPTIONS = settings['options']

    chat_model = ChatModel(template=TEMPLATE, system=system_prompt, options=MODEL_OPTIONS, show_logs=settings['show_logs'])
    server = ServerManger(port=PORT, chat_model=chat_model, )
    server.start()