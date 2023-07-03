import { CommandInteraction } from "discord.js";
import Command from "../../../classes/Command.js";
import ClientManager from "../../ClientManager.js";

class Resume extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("resume")
			.setDescription("Resume current paused audio.");
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({
			content: "Resuming audio...",
			ephemeral: true,
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

		const AudioPlayerManager = ClientManager.instance.GetAudioPlayerManager(
			interaction.guildId!,
		);

		AudioPlayerManager?.audioPlayer.Resume();
	}
}

export default new Resume();
