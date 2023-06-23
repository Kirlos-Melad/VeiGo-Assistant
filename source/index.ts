import { config } from "dotenv";
import path, { resolve } from "path";
import __dirname from "./utilities/__dirname.js";
import { Client } from "discord.js";
import VeigoAssistant from "./client/VeigoAssistant.js";

config({ path: resolve(".env"), debug: true });

await Promise.all([
	VeigoAssistant.LoadCommands(
		path.join(__dirname(import.meta.url), "client", "commands"),
		true,
	),

	VeigoAssistant.LoadEvents(
		path.join(__dirname(import.meta.url), "client", "events"),
		true,
	),
]);

await VeigoAssistant.Run();
