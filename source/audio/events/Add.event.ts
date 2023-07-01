import {
	EmbedBuilder,
} from "discord.js";
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

			const embed = new EmbedBuilder();

			embed.setTitle("Added song to the queue");
			embed.setDescription(
				`New song **[${audio!.title}](${
					audio!.url
				})** was added to the queue!`,
			);
			embed.setThumbnail(audio!.thumbnail || null);
			embed.setColor("#00ff00");
			embed.addFields([]);
			embed.setFooter({
				text: `Duration: ${audio!.duration}`,
			});

			editReply({ embeds: [embed] });
		};
	}
}

export default new Add();
