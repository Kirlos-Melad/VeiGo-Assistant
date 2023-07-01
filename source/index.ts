import path from "path";

import { Client, GatewayIntentBits } from "discord.js";
import VeigoAssistant from "./client/ClientManager.js";
import __dirname from "./utilities/__dirname.js";
import DependencyLoader from "./utilities/DependencyLoader.js";
import Command from "./classes/Command.js";
import BotEvent from "./classes/BotEvent.js";
import LoggerService from "./services/Logger.service.js";

async function LoadCommands(directory: string, recursive?: boolean) {
	const vgaInstance = VeigoAssistant.instance;
	const loadedCommands = await DependencyLoader(directory, recursive);

	for (const commandImports of loadedCommands) {
		const { default: command } = commandImports;
		if (command instanceof Command) {
			vgaInstance.AddCommand(command);
		} else {
			LoggerService.warning(`[WARNING] A command is missing`);
		}
	}
}

async function LoadEvents(directory: string, recursive?: boolean) {
	const vgaInstance = VeigoAssistant.instance;
	const loadedEvents = await DependencyLoader(directory, recursive);

	for (const eventImports of loadedEvents) {
		const { default: event } = eventImports;

		if (event instanceof BotEvent) {
			vgaInstance.AddListener(event);
		} else {
			LoggerService.warning(`[WARNING] An event is missing`);
		}
	}
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildVoiceStates,
	],
});

const vgaInstance = VeigoAssistant.Create(client);

await Promise.all([
	LoadCommands(
		path.join(__dirname(import.meta.url), "client", "commands"),
		true,
	),

	LoadEvents(path.join(__dirname(import.meta.url), "client", "events"), true),
]);

await vgaInstance.Run();
