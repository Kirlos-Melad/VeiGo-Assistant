import { Client, Events } from "discord.js";

import BotEvent from "../../interfaces/BotEvent.ts";
import LoggerService from "../../services/Logger.service.ts";

class ClientReady extends BotEvent<Events.ClientReady> {
	constructor() {
		super(Events.ClientReady);
	}

	public listener(context: unknown) {
		return (client: Client<boolean>) => {
			LoggerService.information(`${client.user?.username} is online!`);
		};
	}
}

export default new ClientReady();
