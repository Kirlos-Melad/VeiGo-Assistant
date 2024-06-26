import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import Command from "../../../base/Command.ts";
import ClientManager from "../../ClientManager.ts";

class Pause extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("pause")
				.setDescription("Pause current running audio."),
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
			content: "Pausing audio...",
		});

		const GuildManager = ClientManager.instance.GetGuildManager(
			interaction.guildId!,
		);

		GuildManager?.audioPlayer.Pause();
	}
}

export default new Pause();
