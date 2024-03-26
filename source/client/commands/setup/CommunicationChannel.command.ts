import {
	ChannelType,
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
	TextBasedChannel,
} from "discord.js";

import Command from "../../../base/Command.ts";
import ClientManager from "../../ClientManager.ts";

class CommunicationChannel extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("communication-channel")
				.setDescription("Setup communication channel."),
		);

		this.mCommandBuilder.addChannelOption((option) => {
			option.setName("channel");
			option.setDescription("Channel to use");
			option.addChannelTypes(ChannelType.GuildText);
			option.setRequired(true);
			return option;
		});
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		const GuildManager = ClientManager.instance.GetGuildManager(
			interaction.guildId!,
		);

		const channel = interaction.options.get("channel")!
			.channel as TextBasedChannel;

		await interaction.editReply({
			content: `Setting up communication channel to ${channel}!`,
		});

		await GuildManager!.SetCommunicationChannel(channel);

		GuildManager!.GetCommunicationChannel()!.send(
			`Communication channel is set successfully to ${channel}!`,
		);
	}
}

export default new CommunicationChannel();
