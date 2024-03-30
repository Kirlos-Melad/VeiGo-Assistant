import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import ClientManager from "@source/client/ClientManager.ts";
import Command from "../../../base/Command.ts";

class EnableAI extends Command<SlashCommandSubcommandBuilder> {
	constructor() {
		super(
			new SlashCommandSubcommandBuilder()
				.setName("ask")
				.setDescription("Ask Veigo a question."),
		);

		this.mCommandBuilder.addStringOption((option) => {
			option.setName("question");
			option.setDescription("Question to ask Veigo.");
			option.setRequired(true);
			return option;
		});
	}

	public async execute(interaction: ChatInputCommandInteraction) {
		if (!ClientManager.instance.AIManger.is_online) {
			await interaction.editReply({
				content: "I'm busy at the moment. Try again later.",
			});
			return;
		}

		const question = interaction.options.getString("question")!;

		await interaction.editReply({
			content: await ClientManager.instance.AIManger.Ask(question),
		});
	}
}

export default new EnableAI();
