import { Awaitable, Message, Events } from "discord.js";

import BotEvent from "../../../classes/BotEvent.js";

class MessageCreate extends BotEvent<Events.MessageCreate> {
	constructor() {
		super(Events.MessageCreate);
	}

	public listener(context: any, message: Message<boolean>) {
		if (message.author.bot) return;

		console.log(`User sent: ${message.content}`);

		return;
	}
}

export default new MessageCreate();
