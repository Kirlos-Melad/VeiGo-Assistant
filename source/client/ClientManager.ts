import { Client, REST, Routes, ClientEvents } from "discord.js";
import path from "path";

import BotEvent from "../classes/BotEvent.js";
import Command from "../classes/Command.js";
import { RetryAsyncCallback } from "../utilities/RetryCallback.js";
import LoggerService from "../services/Logger.service.js";
import AudioPlayerManager from "../audio/AudioPlayerManager.js";
import DependencyLoader from "../utilities/DependencyLoader.js";
import __dirname from "../utilities/__dirname.js";

class ClientManager {
	private static mInstance: ClientManager;

	private mDiscordClient: Client;
	private mCommands: Record<string, Command>;
	private mServers: Record<string, AudioPlayerManager>;

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

	private AddCommand(command: Command) {
		this.mCommands[command.metadata.name] = command;
	}

	public async LoadCommands() {
		const loadedEvents = await DependencyLoader(
			path.join(__dirname(import.meta.url), "commands"),
			true,
		);

		for (const { default: command } of loadedEvents) {
			if (command instanceof Command) {
				LoggerService.information(
					`Loaded command ${command.metadata.name}`,
				);
				this.AddCommand(command);
			} else {
				LoggerService.warning(`[WARNING] A command is missing`);
			}
		}
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

	public GetAudioPlayerManager(serverId: string) {
		return this.mServers[serverId];
	}

	public async Run() {
		await RetryAsyncCallback(3, async () => {
			await Promise.all([
				//this.mAudioPlayer.extractors.register(YouTubeExtractor, {}),
				this.mDiscordClient.login(process.env.CLIENT_TOKEN),
			]);
		});

		this.mDiscordClient.guilds.cache.forEach((guild) => {
			this.mServers[guild.id] = new AudioPlayerManager(
				guild.id,
				guild.voiceAdapterCreator,
			);
		});

		await Promise.all(
			Object.values(this.mServers).map((server) => server.LoadEvents()),
		);

		console.clear();
		LoggerService.information(
			`${this.mDiscordClient.user?.username} is online!`,
		);
	}
}

export default ClientManager;
