import {
	ChannelType,
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
	TextBasedChannel,
} from "discord.js";

import Command from "../../../classes/Command.ts";
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
		const serverManager = ClientManager.instance.GetServerManager(
			interaction.guildId!,
		);

		interaction.editReply({
			content: "Setting up communication channel...",
		});

		serverManager!.communicationChannel =
			(interaction.options.get("channel")?.channel as TextBasedChannel) ??
			undefined;
	}
}

export default new CommunicationChannel();
