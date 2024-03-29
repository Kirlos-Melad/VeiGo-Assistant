import {
    ChannelType,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    TextBasedChannel,
} from "discord.js";

import Command from "../../../base/Command.ts";
import ClientManager from "../../ClientManager.ts";
import Environments from "@source/configurations/Environments.ts";

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

		GuildManager!.GetCommunicationChannel()!.send({
			embeds: [
				{
					author: {
						name: Environments.AUTHOR_NAME,
						icon_url: Environments.AUTHOR_IMAGE_URL,
						url: Environments.AUTHOR_PROFILE_URL,
					},
					description: `
					**Behold!** I, ${Environments.AUTHOR_NAME} (AKA ${Environments.AUTHOR_NICKNAME}), your (not-so-glorious) leader... but definitely the mastermind behind this latest creation (or at least the latest thing I haven't broken): ${ClientManager.name}!

					Now, fear not! ${ClientManager.name} isn't here to take over the world **(phew!)**  but it's here to make your Discord experience a whole lot smoother. Think of it as a super-powered to-do list on steroids!

					***My beautiful creation has set the communication channel to ${channel}. Prepare to be amazed (or at least mildly impressed)!***

					P.S. While world domination isn't on ${ClientManager.name}'s current agenda... who knows what the future holds?  (Just kidding... mostly.)
					`,
				},
			],
		});
	}
}

export default new CommunicationChannel();
