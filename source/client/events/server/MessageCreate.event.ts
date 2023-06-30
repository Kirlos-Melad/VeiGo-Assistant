import {  Message, Events } from "discord.js";

import BotEvent from "../../../classes/BotEvent.js";
import LoggerService from "../../../services/Logger.service.js";

class MessageCreate extends BotEvent<Events.MessageCreate> {
	constructor() {
		super(Events.MessageCreate);
	}

	public listener(context: any, message: Message<boolean>) {
		if (message.author.bot) return;

		LoggerService.information(`User sent: ${message.content}`);

		return;
	}
}

export default new MessageCreate();