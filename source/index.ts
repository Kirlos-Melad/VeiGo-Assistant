import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import path from "path";

import ClientManager from "./client/ClientManager.ts";
import __dirname from "./utilities/__dirname.ts";

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
const [_, { SetupGroupCommand, DebugGroupCommand, AudioGroupCommand }] =
	await Promise.all([
		vgaInstance.LoadEvents(),
		import("./client/commands/initialize.commands.ts"),
	]);

vgaInstance.AddGroupCommand(SetupGroupCommand);
vgaInstance.AddGroupCommand(DebugGroupCommand);
vgaInstance.AddGroupCommand(AudioGroupCommand);
await vgaInstance.UpdateCommands();

await vgaInstance.Run();
