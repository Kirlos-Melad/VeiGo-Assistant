import { EmbedBuilder } from "discord.js";

import AudioPlayerEvent from "../../base/AudioEvent.ts";
import { Audio } from "../AudioPlayer.ts";
import Queue from "../../utilities/Queue.ts";
import GuildManager from "../../guild/GuildManager.ts";

class Play extends AudioPlayerEvent<"PLAY_AUDIO"> {
	constructor() {
		super("PLAY_AUDIO");
	}

	public listener(context: GuildManager) {
		return (queue: Queue<Audio>, audio: Audio) => {
			const embed = new EmbedBuilder()
				.setTitle("Now Playing")
				.setDescription(`🎶 Playing: **[${audio.name}](${audio.url})**`)
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

export default new Play();
