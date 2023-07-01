import { Client, GatewayIntentBits } from "discord.js";
import VeigoAssistant from "./client/ClientManager.js";
import __dirname from "./utilities/__dirname.js";
import DependencyLoader from "./utilities/DependencyLoader.js";
import Command from "./classes/Command.js";
import BotEvent from "./classes/BotEvent.js";
import LoggerService from "./services/Logger.service.js";

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
await Promise.all([vgaInstance.LoadEvents(), vgaInstance.LoadCommands()]);
vgaInstance.UpdateCommands();

await vgaInstance.Run();
