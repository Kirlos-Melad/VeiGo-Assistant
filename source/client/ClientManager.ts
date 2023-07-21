import {
	Client,
	REST,
	Routes,
	ClientEvents,
	ChannelType,
	SlashCommandBuilder,
} from "discord.js";
import path from "path";

import BotEvent from "../classes/BotEvent.js";
import { RetryAsyncCallback } from "../utilities/RetryCallback.js";
import LoggerService from "../services/Logger.service.js";
import ServerManager from "../core/ServerManager.js";
import DependencyLoader from "../utilities/DependencyLoader.js";
import __dirname from "../utilities/__dirname.js";
import GroupCommand from "../core/GroupCommand.js";

class ClientManager {
	private static mInstance: ClientManager;

	private mDiscordClient: Client;
	private mCommands: Record<string, GroupCommand>;
	private mServers: Record<string, ServerManager>;

	private constructor(discordClient: Client) {
		this.mDiscordClient = discordClient;
		this.mCommands = {};
		this.mServers = {};
	}

	public static Create(discordClient: Client) {
		if (!ClientManager.mInstance) {
			ClientManager.mInstance = new ClientManager(discordClient);
		} else {
			LoggerService.warning("[WARNING] Bot has already been created");
		}

		return ClientManager.mInstance;
	}

	public static get instance() {
		if (!ClientManager.mInstance) {
			throw new Error("Bot has not been created yet");
		}

		return ClientManager.mInstance;
	}

	private AddEvent<T extends keyof ClientEvents>(event: BotEvent<T>): void {
		this.mDiscordClient.on(
			event.name,
			event.listener({ commands: this.mCommands }),
		);
	}

	public async LoadEvents() {
		const loadedEvents = await DependencyLoader(
			path.join(__dirname(import.meta.url), "events"),
			false,
		);

		for (const { default: event } of loadedEvents) {
			if (event instanceof BotEvent) {
				LoggerService.information(`Loaded event ${event.name}`);
				this.AddEvent(event);
			} else {
				LoggerService.warning(`[WARNING] An event is missing`);
			}
		}
	}

	public AddGroupCommand(groupCommand: GroupCommand) {
		this.mCommands[groupCommand.metadata.name] = groupCommand;
	}

	public async UpdateCommands() {
		const rest = new REST().setToken(process.env.CLIENT_TOKEN!);
		const commandsMetadata = Object.values(this.mCommands).map(
			(command) => {
				return command.metadata;
			},
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		await RetryAsyncCallback(3, async () => {
			await rest.put(
				Routes.applicationCommands(process.env.APPLICATION_ID!),
				{
					body: commandsMetadata,
				},
			);
		});
	}

	public GetServerManager(serverId: string) {
		return this.mServers[serverId];
	}

	public async Run() {
		await RetryAsyncCallback(3, async () => {
			await this.mDiscordClient.login(process.env.CLIENT_TOKEN);
		});

		this.mDiscordClient.guilds.cache.forEach((guild) => {
			this.mServers[guild.id] = new ServerManager(guild);
		});

		await Promise.all(
			Object.values(this.mServers).map((server) => server.LoadEvents()),
		);

		console.clear();
		LoggerService.information(
			`${this.mDiscordClient.user?.username} is ready to go!`,
		);
	}
}

export default ClientManager;
