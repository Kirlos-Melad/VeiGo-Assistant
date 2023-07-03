import { CommandInteraction } from "discord.js";
import Command from "../../../classes/Command.js";
import ClientManager from "../../ClientManager.js";

class Pause extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("pause")
			.setDescription("Pause current running audio.");
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({
			content: "Pausing audio...",
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

		AudioPlayerManager?.audioPlayer.Pause();
	}
}

export default new Pause();
