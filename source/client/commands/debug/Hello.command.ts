import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import Command from "../../../classes/Command.js";

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
		await interaction.reply({
			content: `Hello ${interaction.user.username} my name is ${interaction.client.user?.username}, And i'm here to help you!`,
			ephemeral: true,
		});
	}
}

export default new Hello();
