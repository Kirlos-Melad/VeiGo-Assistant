import { config } from "dotenv";
import path, { resolve } from "path";
import __dirname from "./utilities/__dirname.js";
import { Client } from "discord.js";
import Bot from "./client/Bot.js";

config({ path: resolve(".env"), debug: true });

const veigoAssistant = Bot.CreateInstance(new Client({ intents: [] }));

await Promise.all([
	veigoAssistant.LoadCommands(
		path.join(__dirname(import.meta.url), "client", "commands"),
		true,
	),

	veigoAssistant.LoadEvents(
		path.join(__dirname(import.meta.url), "client", "events"),
		true,
	),
]);

await veigoAssistant.Run();
