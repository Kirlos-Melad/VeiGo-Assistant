import { Awaitable, EmbedBuilder, TextBasedChannel } from "discord.js";

import AudioPlayerEvent from "../../classes/AudioEvents.js";
import Audio from "../@types/Audio.js";
import Queue from "../../utilities/Queue.js";

class Play extends AudioPlayerEvent<"PLAY_AUDIO"> {
	constructor() {
		super("PLAY_AUDIO");
	}

	public listener(context: { textChannel: TextBasedChannel | null }) {
		return (queue: Queue<Audio>, audio: Audio) => {
			if (!context.textChannel) return;

			const embed = new EmbedBuilder();

			embed.setTitle("Playing song");
			embed.setDescription(
				`Playing **[${audio!.title}](${audio!.url})**`,
			);
			embed.setThumbnail(audio!.thumbnail || null);
			embed.setColor("#00ff00");
			embed.addFields([]);
			embed.setFooter({
				text: `Duration: ${audio!.duration}`,
			});

			context.textChannel.send({ embeds: [embed] });
		};
	}
}

export default new Play();
