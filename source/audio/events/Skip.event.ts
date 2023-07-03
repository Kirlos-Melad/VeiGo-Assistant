import { EmbedBuilder } from "discord.js";
import AudioPlayerEvent from "../../classes/AudioEvents.js";
import Audio from "../@types/Audio.js";
import Queue from "../../utilities/Queue.js";
import AudioPlayerManager from "../AudioPlayerManager.js";

class Add extends AudioPlayerEvent<"SKIP_AUDIO"> {
	constructor() {
		super("SKIP_AUDIO");
	}

	public listener(context: AudioPlayerManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const { textChannel } = context.GetContext();
			if (!textChannel) return;

			const embed = new EmbedBuilder()
				.setTitle("Audio Skipped")
				.setDescription(`⏩ Skipped: **[${audio.name}](${audio.url})**`)
				.setThumbnail(audio.thumbnail)
				.addFields([
					{
						name: "Duration",
						value: audio.duration,
						inline: true,
					},
				])
				.setFooter({
					text: "Developed by Veigo 😎🔥",
					iconURL:
						"https://avatars.githubusercontent.com/u/52179817?v=4",
				});

			textChannel.send({ embeds: [embed] });
		};
	}
}

export default new Add();
