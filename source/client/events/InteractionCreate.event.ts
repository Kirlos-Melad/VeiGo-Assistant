import { Interaction, Events, CacheType } from "discord.js";

import BotEvent from "../../classes/BotEvent.js";
import LoggerService from "../../services/Logger.service.js";
import Command from "../../classes/Command.js";

class InteractionCreate extends BotEvent<Events.InteractionCreate> {
	constructor() {
		super(Events.InteractionCreate);
	}

	public listener(context: { commands: Record<string, Command> }) {
		return async (interaction: Interaction<CacheType>) => {
			if (!interaction.isChatInputCommand()) return;

			const { commands } = context;
			const command = commands[interaction.commandName];

			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (error) {
				LoggerService.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content:
							"There was an error while executing this command!",
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content:
							"There was an error while executing this command!",
						ephemeral: true,
					});
				}
			}
		};
	}
}

export default new InteractionCreate();
