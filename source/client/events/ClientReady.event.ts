import { Client, Events } from "discord.js";

import BotEvent from "../../classes/BotEvent.js";
import LoggerService from "../../services/Logger.service.js";
import Command from "../../classes/Command.js";

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
