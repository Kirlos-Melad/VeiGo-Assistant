import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../base/AudioEvents.ts";
import { Audio } from "../AudioPlayer.ts";
import Queue from "../../utilities/Queue.ts";
import GuildManager from "../../guild/GuildManager.ts";

class Add extends AudioPlayerEvent<"ADD_AUDIO"> {
	constructor() {
		super("ADD_AUDIO");
	}

	public listener(context: GuildManager) {
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
				.setFooter(this.mEmbedFooterOptions);

			context.GetCommunicationChannel()?.send({ embeds: [embed] });
		};
	}
}

export default new Add();
