import { Message, Events } from "discord.js";

import ClientEvent from "../../base/ClientEvent.ts";
import Logger from "../../utilities/Logger.ts";

class MessageCreate extends ClientEvent<Events.MessageCreate> {
	constructor() {
		super(Events.MessageCreate);
	}

	public listener(context: unknown) {
		return (message: Message<boolean>) => {
			if (message.author.bot) return;

			Logger.information(`User sent: ${message.content}`);

			return;
		};
	}
}

export default new MessageCreate();
