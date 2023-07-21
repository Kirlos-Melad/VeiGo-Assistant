import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import Command from "../../../interfaces/Command.ts";
import ClientManager from "../../ClientManager.ts";

class Skip extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("skip")
				.setDescription("Skip current running audio."),
		);
	}

	async execute(interaction: ChatInputCommandInteraction) {
		const member = await interaction.guild?.members.fetch({
			user: interaction.user.id,
		});

		if (!member?.voice.channelId) {
			interaction.editReply({
				content: "You must be in a voice channel to use this command!",
			});
			return;
		}

		interaction.editReply({
			content: "Skipping audio...",
		});

		const serverManager = ClientManager.instance.GetServerManager(
			interaction.guildId!,
		);

		serverManager?.audioPlayer.Skip();
	}
}

export default new Skip();
