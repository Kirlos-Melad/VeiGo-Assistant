import {
	Interaction,
	Events,
	CacheType,
	SlashCommandBuilder,
} from "discord.js";

import BotEvent from "../../classes/BotEvent.ts";
import LoggerService from "../../services/Logger.service.ts";
import Command from "../../classes/Command.ts";
import ClientManager from "../ClientManager.ts";

class InteractionCreate extends BotEvent<Events.InteractionCreate> {
	constructor() {
		super(Events.InteractionCreate);
	}

	public listener(context: {
		commands: Record<string, Command<SlashCommandBuilder>>;
	}) {
		return async (interaction: Interaction<CacheType>) => {
			if (!interaction.isChatInputCommand()) return;

			if (!interaction.guildId) {
				await interaction.reply({
					content: "I can only be used in a server!",
					ephemeral: true,
				});
				return;
			}

			if (!ClientManager.instance.GetServerManager(interaction.guildId)) {
				await interaction.reply({
					content: "I am not setup in this server yet!",
					ephemeral: true,
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

			try {
				await command.execute(interaction);
			} catch (error) {
				LoggerService.error(error);

				if (interaction.replied) {
					await interaction.followUp({
						content: `There was an error while executing ${command.metadata.name}`,
						ephemeral: true,
					});
				} else if (interaction.deferred) {
					await interaction.editReply({
						content: `There was an error while executing ${command.metadata.name}`,
					});
				} else {
					await interaction.reply({
						content: `There was an error while executing ${command.metadata.name}`,
						ephemeral: true,
					});
				}
			}
		};
	}
}

export default new InteractionCreate();
