import { Events, Guild } from "discord.js";

import ClientEvent from "../../base/ClientEvent.ts";

class GuildCreate extends ClientEvent<Events.GuildCreate> {
	constructor() {
		super(Events.GuildCreate);
	}

	public listener(context: {
		CreateGuildManager: (guild: Guild) => Promise<void>;
	}) {
		return async (guild: Guild) => await context.CreateGuildManager(guild);
	}
}

export default new GuildCreate();
