import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../classes/AudioEvents.ts";
import Audio from "../IAudio.ts";
import Queue from "../../utilities/Queue.ts";
import ServerManager from "../../core/ServerManager.ts";

class Play extends AudioPlayerEvent<"PLAY_AUDIO"> {
	constructor() {
		super("PLAY_AUDIO");
	}

	public listener(context: ServerManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const embed = new EmbedBuilder();

			embed.setTitle("Now Playing");
			embed.setDescription(
				`🎶 Playing: **[${audio.name}](${audio.url})**`,
			);
			embed.setThumbnail(audio.thumbnail);
			embed
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

export default new Play();
