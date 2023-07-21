import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import Command from "../../../interfaces/Command.ts";

class Hello extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("hello")
				.setDescription(
					"Says hello to the user who invoked the command.",
				),
		);
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.editReply({
			content: `Hello ${interaction.user.username} my name is ${interaction.client.user?.username}, And i'm here to help you!`,
		});
	}
}

export default new Hello();
