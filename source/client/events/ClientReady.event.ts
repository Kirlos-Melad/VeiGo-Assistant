import { Client, Events } from "discord.js";

import ClientEvent from "../../base/ClientEvent.ts";
import Logger from "../../utilities/Logger.ts";

class ClientReady extends ClientEvent<Events.ClientReady> {
	constructor() {
		super(Events.ClientReady);
	}

	public listener(context: unknown) {
		return (client: Client<boolean>) => {
			Logger.information(`${client.user?.username} is online!`);
		};
	}
}

export default new ClientReady();
