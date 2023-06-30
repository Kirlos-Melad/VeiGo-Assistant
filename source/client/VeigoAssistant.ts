import { Client, REST, Routes, ClientEvents } from "discord.js";
import BotEvent from "../classes/BotEvent.js";
import Command from "../classes/Command.js";

import { RetryAsyncCallback } from "../utilities/RetryCallback.js";
import LoggerService from "../services/Logger.service.js";
import ServerBot from "./ServerBot.js";

class VeigoAssistant {
	private static mInstance: VeigoAssistant;

	private mDiscordClient: Client;
	private mCommands: Record<string, Command>;
	private mServers: Record<string, ServerBot>;

	private constructor(discordClient: Client) {
		this.mDiscordClient = discordClient;
		this.mCommands = {};
		this.mServers = {};
	}

	public static Create(discordClient: Client) {
		if (!VeigoAssistant.mInstance) {
			VeigoAssistant.mInstance = new VeigoAssistant(discordClient);
		} else {
			LoggerService.warning("[WARNING] Bot has already been created");
		}

		return VeigoAssistant.mInstance;
	}

	public static get instance() {
		if (!VeigoAssistant.mInstance) {
			throw new Error("Bot has not been created yet");
		}

		return VeigoAssistant.mInstance;
	}

	/* Overloaded function */
	AddEvent<T extends keyof ClientEvents>(event: BotEvent<T>): void;
	// AddEvent<T extends keyof typeof GuildQueueEvent>(
	// 	event: AudioPlayerEvent<T>,
	// ): void;
	AddEvent(event: any): void {
		// Implement the method logic here
		// You can use type guards to distinguish between BotEvent and AudioPlayerEvent
		if (event instanceof BotEvent) {
			this.mDiscordClient.on(event.name, (...args: ClientEvents[]) => {
				event.listener({ commands: this.mCommands }, ...args);
			});
		}
		// else if (event instanceof AudioPlayerEvent) {
		// 	this.mAudioPlayer.events.on(event.name, event.listener);
		// }
	}

	AddListeners<T extends keyof ClientEvents>(events: BotEvent<T>[]): void;
	// AddListeners<T extends keyof typeof GuildQueueEvent>(
	// 	events: AudioPlayerEvent<T>[],
	// ): void;
	AddListeners(events: any[]): void {
		for (const event of events) {
			this.AddEvent(event);
		}
	}

	public AddCommand(command: Command) {
		this.mCommands[command.metadata.name] = command;
	}

	public AddCommands(commands: Command[]) {
		for (const command of commands) {
			this.AddCommand(command);
		}
	}

	public async UpdateClientCommands() {
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

	public GetServer(serverId: string) {
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
			this.mServers[guild.id] = new ServerBot(
				guild.id,
				guild.voiceAdapterCreator,
			);
		});

		console.clear();
		LoggerService.information(
			`${this.mDiscordClient.user?.username} is online!`,
		);
	}
}

export default VeigoAssistant;
