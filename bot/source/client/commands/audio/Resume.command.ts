import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import Command from "../../../base/Command.ts";
import ClientManager from "../../ClientManager.ts";

class Resume extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("resume")
				.setDescription("Resume current paused audio."),
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
			content: "Resuming audio...",
		});

		const GuildManager = ClientManager.instance.GetGuildManager(
			interaction.guildId!,
		);

		GuildManager?.audioPlayer.Resume();
	}
}

export default new Resume();
