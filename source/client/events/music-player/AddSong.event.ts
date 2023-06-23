import { Events, Queue, Song } from "distube";

import MusicPlayerEvent from "../../../classes/MusicPlayerEvent.js";
import {
	EmbedBuilder,
	InteractionEditReplyOptions,
	Message,
	MessagePayload,
} from "discord.js";

class AddSong extends MusicPlayerEvent<Events.ADD_SONG> {
	public listener: (queue: Queue, song: Song<unknown>) => any;

	constructor() {
		super(Events.ADD_SONG);
		this.listener = this.handler;
	}

	private handler(queue: Queue, song: Song<unknown>) {
		const embed = new EmbedBuilder();

		embed.setTitle("Added song to the queue");
		embed.setDescription(
			`New song **[${song!.name}](${
				song!.url
			})** was added to the queue!`,
		);
		embed.setThumbnail(song!.thumbnail || null);
		embed.setColor("#00ff00");
		embed.addFields([]);
		embed.setFooter({
			text: `Duration: ${song!.formattedDuration}`,
		});

		const metadata = song.metadata as {
			editReply: (
				options: string | MessagePayload | InteractionEditReplyOptions,
			) => Promise<Message<boolean>>;
		};
		metadata?.editReply({ embeds: [embed] });
	}
}

export default new AddSong();
