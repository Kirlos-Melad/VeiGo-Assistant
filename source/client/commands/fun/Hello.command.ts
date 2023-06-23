import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../../../classes/Command.js";

class Hello extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("hello")
			.setDescription("Says hello to the user who invoked the command.");
	}

	public async execute(interaction: CommandInteraction) {
		await interaction.reply({
			content: `Hello ${interaction.user.username} my name is ${interaction.client.user?.username}, And i'm here to help you!`,
			ephemeral: true,
		});
	}
}

export default new Hello();
