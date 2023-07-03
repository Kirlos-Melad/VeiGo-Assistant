import { EmbedBuilder } from "discord.js";
import AudioPlayerEvent from "../../classes/AudioEvents.js";
import Audio from "../@types/Audio.js";
import Queue from "../../utilities/Queue.js";
import AudioPlayerManager from "../AudioPlayerManager.js";

class Add extends AudioPlayerEvent<"ADD_AUDIO"> {
	constructor() {
		super("ADD_AUDIO");
	}

	public listener(context: AudioPlayerManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const { editReply } = context.GetContext();
			if (!editReply) return;

			const embed = new EmbedBuilder()
				.setTitle("New audio added to queue")
				.setDescription(
					`🎵 A new audio has been added to the queue: **[${audio.name}](${audio.url})**`,
				)
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

			editReply({ embeds: [embed] });
		};
	}
}

export default new Add();
