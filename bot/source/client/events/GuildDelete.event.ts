import { Events, Guild } from "discord.js";

import ClientEvent from "../../base/ClientEvent.ts";

class GuildDelete extends ClientEvent<Events.GuildDelete> {
	constructor() {
		super(Events.GuildDelete);
	}

	public listener(context: {
		DeleteGuildManager: (guildId: string) => Promise<void>;
	}) {
		return async (guild: Guild) =>
			await context.DeleteGuildManager(guild.id);
	}
}

export default new GuildDelete();
