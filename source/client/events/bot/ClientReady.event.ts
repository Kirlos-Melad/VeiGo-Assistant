import { Awaitable, Client, Events } from "discord.js";

import BotEvent from "../../../classes/BotEvent.js";

class ClientReady extends BotEvent<Events.ClientReady> {
	constructor() {
		super(Events.ClientReady);
	}

	public listener(context: any, client: Client<boolean>) {
		console.log(`${client.user?.username} is online!`);
	}
}

export default new ClientReady();
