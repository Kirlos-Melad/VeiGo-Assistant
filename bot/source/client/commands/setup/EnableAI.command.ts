import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import Command from "../../../base/Command.ts";
import ClientManager from "@source/client/ClientManager.ts";

class EnableAI extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("enable-ai")
				.setDescription("Enable AI for the guild"),
		);

		this.mCommandBuilder.addBooleanOption((option) => {
			option.setName("value");
			option.setDescription("boolean value to enable or disable AI.");
			option.setRequired(true);
			return option;
		});
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		const enableAi = interaction.options.getBoolean("value")!;
		if (enableAi) {
			// await ClientManager.instance.AIManger.Start();
			await interaction.editReply({
			content: "AI has been enabled for this guild." ,
		});
		
		}
		else{
			await interaction.editReply({
			content: "AI has been disabled for this guild." ,});
		}
		

	}
}

export default new EnableAI();
