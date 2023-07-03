import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import path from "path";

import ClientManager from "./client/ClientManager.js";
import __dirname from "./utilities/__dirname.js";

if (!process.env.IS_PRODUCTION)
	config({
		path: path.join(__dirname(import.meta.url), "..", ".env"),
	});

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

const vgaInstance = ClientManager.Create(client);
await Promise.all([vgaInstance.LoadEvents(), vgaInstance.LoadCommands()]);
await vgaInstance.UpdateCommands();

await vgaInstance.Run();
