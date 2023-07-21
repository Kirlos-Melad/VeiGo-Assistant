import { Message, Events } from "discord.js";

import BotEvent from "../../interfaces/BotEvent.ts";
import LoggerService from "../../services/Logger.service.ts";

class MessageCreate extends BotEvent<Events.MessageCreate> {
	constructor() {
		super(Events.MessageCreate);
	}

	public listener(context: unknown) {
		return (message: Message<boolean>) => {
			if (message.author.bot) return;

			LoggerService.information(`User sent: ${message.content}`);

			return;
		};
	}
}

export default new MessageCreate();
