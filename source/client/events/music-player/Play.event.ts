import { Events, Queue, Song } from "distube";

import MusicPlayerEvent from "../../../classes/MusicPlayerEvent.js";
import {
	EmbedBuilder,
} from "discord.js";

class Play extends MusicPlayerEvent<Events.PLAY_SONG> {
	public listener: (queue: Queue, song: Song<unknown>) => any;

	constructor() {
		super(Events.PLAY_SONG);
		this.listener = this.handler;
	}

	private handler(queue: Queue, song: Song<unknown>) {
		const embed = new EmbedBuilder();

		embed.setTitle("Playing song");
		embed.setDescription(`Playing **[${song!.name}](${song!.url})**`);
		embed.setThumbnail(song!.thumbnail || null);
		embed.setColor("#00ff00");
		embed.addFields([]);
		embed.setFooter({
			text: `Duration: ${song!.formattedDuration}`,
		});

		queue.textChannel!.send({ embeds: [embed] });
	}
}

export default new Play();
