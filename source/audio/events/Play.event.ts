import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../classes/AudioEvents.js";
import Audio from "../@types/Audio.js";
import Queue from "../../utilities/Queue.js";
import AudioPlayerManager from "../AudioPlayerManager.js";

class Play extends AudioPlayerEvent<"PLAY_AUDIO"> {
	constructor() {
		super("PLAY_AUDIO");
	}

	public listener(context: AudioPlayerManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const { textChannel } = context.GetContext();
			if (!textChannel) return;

			const embed = new EmbedBuilder();

			embed.setTitle("Now Playing");
			embed.setDescription(
				`🎶 Playing: **[${audio!.title}](${audio!.url})**`,
			);
			embed.setThumbnail(audio!.thumbnail);
			embed.addFields([
				{
					name: "Duration",
					value: audio!.duration,
					inline: true,
				},
			]);

			textChannel.send({ embeds: [embed] });
		};
	}
}

export default new Play();
