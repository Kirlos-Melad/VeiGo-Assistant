import {
	Interaction,
	Events,
	CacheType,
	SlashCommandBuilder,
} from "discord.js";

import ClientEvent from "../../base/ClientEvent.ts";
import Logger from "../../utilities/Logger.ts";
import Command from "../../base/Command.ts";
import ClientManager from "../ClientManager.ts";

class InteractionCreate extends ClientEvent<Events.InteractionCreate> {
	constructor() {
		super(Events.InteractionCreate);
	}

	public listener(context: {
		commands: Record<string, Command<SlashCommandBuilder>>;
	}) {
		return async (interaction: Interaction<CacheType>) => {
			if (!interaction.isChatInputCommand()) return;

			try {
				await interaction.deferReply({
					ephemeral: true,
				});

				if (!interaction.guildId) {
					await interaction.editReply({
						content: "I can only be used in a server!",
					});
					return;
				}

				if (
					!ClientManager.instance.GetGuildManager(interaction.guildId)
				) {
					await interaction.editReply({
						content: "I am not setup in this server yet!",
					});
					return;
				}

				const { commands } = context;
				const command = commands[interaction.commandName];

				if (!command) {
					await interaction.reply({
						content: "Command not found!",
						ephemeral: true,
					});
					return;
				}

				await command.execute(interaction);
			} catch (error) {
				Logger.error(error);

				if (interaction.replied) {
					await interaction.followUp({
						content: `There was an error while executing ${interaction.commandName}`,
						ephemeral: true,
					});
				} else if (interaction.deferred) {
					await interaction.editReply({
						content: `There was an error while executing ${interaction.commandName}`,
					});
				} else {
					await interaction.reply({
						content: `There was an error while executing ${interaction.commandName}`,
						ephemeral: true,
					});
				}
			}
		};
	}
}

export default new InteractionCreate();
