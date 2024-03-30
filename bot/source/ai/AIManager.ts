import { io, Socket } from "socket.io-client";

import ConnectEvent from "./events/Connect.event";
import ErrorEvent from "./events/Error.event";
import DisconnectEvent from "./events/Disconnect.event";
import AnswerEvent from "./events/Answer.event";

type AIManagerEvents = {
	CONNECT: [];

	DISCONNECT: [reason: string];

	ERROR: [error: Error];

	ANSWER: [response: string];
};

type AIManagerEventKeys = keyof AIManagerEvents;

type AIManagerEventHandlers = {
	[K in AIManagerEventKeys]: (...args: AIManagerEvents[K]) => Promise<void>;
};

class AIManager {
	private socket: Socket;

	constructor(connection: string) {
		this.socket = io(connection, {
			autoConnect: false,
		});
	}

	public get is_online() {
		return this.socket.connected;
	}

	public Connect() {
		this.socket.on("connect", new ConnectEvent().listener());

		this.socket.on("error", new ErrorEvent().listener());

		this.socket.on("disconnect", new DisconnectEvent().listener());

		this.socket.connect();
	}

	public async Ask(question: string): Promise<string> {
		return new Promise((resolve) => {
			this.socket.once("answer", new AnswerEvent().listener(resolve));

			this.socket.emit("ask", question);
		});
	}
}

export default AIManager;
export type { AIManagerEventKeys, AIManagerEventHandlers };
