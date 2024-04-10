import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../base/AudioEvent.ts";
import { Audio } from "../AudioPlayer.ts";
import Queue from "../../utilities/Queue.ts";
import GuildManager from "../../guild/GuildManager.ts";

class Pause extends AudioPlayerEvent<"PAUSE_AUDIO"> {
	constructor() {
		super("PAUSE_AUDIO");
	}

	public listener(context: GuildManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const embed = new EmbedBuilder()
				.setTitle("Audio Paused")
				.setDescription(`⏸️ Paused: **[${audio.name}](${audio.url})**`)
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

export default new Pause();
