import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../base/AudioEvent.ts";
import { Audio } from "../AudioPlayer.ts";
import Queue from "../../utilities/Queue.ts";
import GuildManager from "../../guild/GuildManager.ts";

class Resume extends AudioPlayerEvent<"RESUME_AUDIO"> {
	constructor() {
		super("RESUME_AUDIO");
	}

	public listener(context: GuildManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const embed = new EmbedBuilder()
				.setTitle("Audio Resumed")
				.setDescription(`▶️ Resumed: **[${audio.name}](${audio.url})**`)
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

export default new Resume();
