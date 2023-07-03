import { CommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../../../classes/Command.js";
import ClientManager from "../../ClientManager.js";

class Skip extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("skip")
			.setDescription("Skip current running audio.");
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({
			content: "Skipping audio...",
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

		AudioPlayerManager?.audioPlayer.Skip();
	}
}

export default new Skip();
