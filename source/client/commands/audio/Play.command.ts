import { CommandInteraction } from "discord.js";
import Command from "../../../classes/Command.js";
import VeigoAssistant from "../../ClientManager.js";

class Play extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("play")
			.setDescription("Plays music from youtube.")
			.addStringOption((option) => {
				option.setName("query");
				option.setDescription("The query to search for.");
				option.setRequired(true);
				return option;
			});
	}

	async execute(interaction: CommandInteraction) {
		interaction.deferReply({
			ephemeral: true,
			fetchReply: true,
		});

		const member = await interaction.guild?.members.fetch({
			user: interaction.user.id,
		});

		if (!member?.voice.channelId) {
			interaction.reply({
				content: "You must be in a voice channel to use this command!",
				ephemeral: true,
			});
			return;
		}

		const AudioPlayerManager =
			VeigoAssistant.instance.GetAudioPlayerManager(interaction.guildId!);
		AudioPlayerManager?.SetContext({
			textChannel: interaction.channel ?? null,
			editReply: interaction.editReply.bind(interaction),
		});
		AudioPlayerManager?.JoinVoiceChannel(member.voice.channelId);
		AudioPlayerManager?.audioPlayer.Play(
			interaction.options.get("query")!.value as string,
		);
	}
}

export default new Play();
