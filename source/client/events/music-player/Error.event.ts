import { Events } from "distube";

import MusicPlayerEvent from "../../../classes/MusicPlayerEvent.js";
import { GuildTextBasedChannel } from "discord.js";

class Error extends MusicPlayerEvent<Events.ERROR> {
	public listener: (
		channel: GuildTextBasedChannel | undefined,
		error: globalThis.Error,
	) => any;

	constructor() {
		super(Events.ERROR);
		this.listener = this.handler;
	}

	private handler(
		channel: GuildTextBasedChannel | undefined,
		error: globalThis.Error,
	) {
		console.log(error);
		channel?.send("Something went wrong! Please try again later.");
	}
}

export default new Error();
