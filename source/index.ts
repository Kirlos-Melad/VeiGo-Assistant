import { Client, GatewayIntentBits } from "discord.js";
import { LogEvent } from "kysely";
import { format as sqlFormatter } from "sql-formatter";

import ClientManager from "./client/ClientManager.ts";
import DatabaseManagerFactory from "./database/DatabaseManager.factory.ts";
import Logger from "./utilities/Logger.ts";
import Environments from "./configurations/Environments.ts";

function DBLogger(event: LogEvent) {
	//if (!Environments.IS_DEVELOPMENT) return;

	if (event.level === "query") {
		try {
			Logger.information(
				`Executed: ${sqlFormatter(event.query.sql)}` +
					`\nExecution Time: ${event.queryDurationMillis}ms`,
			);
		} catch (error) {
			Logger.warning("Failed to format SQL query");
			Logger.information(
				`Executed: ${event.query.sql}` +
					`\nExecution Time: ${event.queryDurationMillis}ms`,
			);
		}
	}
}

async function Migrate() {
	Logger.information("Creating database manager");
	const databaseManager = await DatabaseManagerFactory.Create(
		Environments.DATABASE_CONNECTION,
		Environments.DATABASE_DEFAULT_NAME,
		Environments.DATABASE_NAME,
		DBLogger,
		true,
	);

	Logger.information("Running database migrations");
	await databaseManager.Migrate();
	Logger.information("Database migrations completed");
	process.exit(0);
}

async function Start() {
	Logger.information("Creating database manager");
	const databaseManager = DatabaseManagerFactory.Create(
		Environments.DATABASE_CONNECTION,
		Environments.DATABASE_DEFAULT_NAME,
		Environments.DATABASE_NAME,
		DBLogger,
	);

	Logger.information("Creating server");
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

	const clientManager = ClientManager.Create(client);

	Logger.information("Loading commands");
	const [_, { SetupGroupCommand, DebugGroupCommand, AudioGroupCommand }] =
		await Promise.all([
			clientManager.LoadEvents(),
			import("./client/commands/initialize.commands.ts"),
		]);

	clientManager.AddGroupCommand(SetupGroupCommand);
	clientManager.AddGroupCommand(DebugGroupCommand);
	clientManager.AddGroupCommand(AudioGroupCommand);
	await clientManager.UpdateCommands();

	Logger.information("Starting server");
	await clientManager.Run();

	return {
		Client: clientManager,
		Database: databaseManager,
	};
}

function Help() {
	Logger.information("Available commands:");
	Logger.information("migrate: Run the database migrations");
	Logger.information("start: Start the server");
}

try {
	if (process.argv.length < 3) {
		throw new Error(
			"No arguments provided. Try 'help' for more information.",
		);
	}

	const command = process.argv[2];

	switch (command) {
		case "migrate":
			await Migrate();
			break;

		case "start":
			await Start();
			break;

		case "help":
			Help();
			break;

		default:
			throw new Error(
				"Invalid argument. Try 'help' for more information.",
			);
	}
} catch (error: any) {
	Logger.error(error);
	process.exit(1);
}

export { Start, Migrate, Help, DBLogger };
