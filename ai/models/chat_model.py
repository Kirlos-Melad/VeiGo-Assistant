import os
import subprocess
import time
from typing import Dict

import ollama


class ChatModel:
    def __init__(self, template: str, system: str, options: Dict, show_logs: bool=False) -> None:
        self.model_name = 'Veigo Assistant'
        self.template = template
        self.system = system
        self.options = options
        self.show_logs = show_logs
        self.create_model()

    def serve(self):
        command = 'ollama serve'
        if self.show_logs:
            subprocess.Popen(command, shell=True)
        else:
            subprocess.Popen(command, shell=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(5)

    def _check_if_created(self):
        names = [model["name"].split(":")[0] for model in ollama.list()['models']]
        if self.model_name in names:
            return True
        return False

    def _create(self):
        ollama.create(
            model=self.model_name,
            modelfile=f"FROM {os.getenv('MODEL_PATH')}/{os.getenv('MODEL_NAME')}",
        )

    def create_model(self):
        self.serve()
        try:
            if self._check_if_created():
                print(f'Model {self.model_name} already exists')
                return
            self._create()
            print(f'Model {self.model_name} created successfully')
        except Exception:
            self._create()
            print(f'Model {self.model_name} created successfully')

    def infer(self, prompt: str, limit:int=None) -> str:
        try :
            generated_output = ollama.generate(
                    model=self.model_name,
                    prompt=prompt,
                    template=self.template,
                    system=self.system,
                    options=self.options,
                )
        except Exception:
            return "I am sorry, I am not able to generate a response for that question, please try again."

        if limit:
            return generated_output['response'][:limit]
        return generated_output['response']
