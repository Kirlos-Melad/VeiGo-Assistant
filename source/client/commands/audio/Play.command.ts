import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import Command from "../../../base/Command.ts";
import ClientManager from "../../ClientManager.ts";

class Play extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("play")
				.setDescription("Plays audio"),
		);

		this.mCommandBuilder.addStringOption((option) =>
			option
				.setName("value")
				.setDescription("A search query or URL")
				.setRequired(true),
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

		const GuildManager = ClientManager.instance.GetGuildManager(
			interaction.guildId!,
		);

		interaction.editReply({
			content: "Playing audio...",
		});

		GuildManager?.JoinVoiceChannel(member.voice.channelId);
		GuildManager?.audioPlayer.Play(
			interaction.options.get("value")!.value as string,
		);
	}
}

export default new Play();
