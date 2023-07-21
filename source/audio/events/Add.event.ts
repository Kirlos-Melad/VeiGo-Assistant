import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../classes/AudioEvents.ts";
import Audio from "../IAudio.ts";
import Queue from "../../utilities/Queue.ts";
import ServerManager from "../../core/ServerManager.ts";

class Add extends AudioPlayerEvent<"ADD_AUDIO"> {
	constructor() {
		super("ADD_AUDIO");
	}

	public listener(context: ServerManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
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

			context.communicationChannel?.send({ embeds: [embed] });
		};
	}
}

export default new Add();
