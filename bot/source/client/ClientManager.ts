import { Client, ClientEvents, Guild, REST, Routes } from "discord.js";
import path from "path";

import AIManager from "../ai/AIManager.ts";
import AudioPlayer from "../audio/AudioPlayer.ts";
import ClientEvent from "../base/ClientEvent.ts";
import GroupCommand from "../base/GroupCommand.ts";
import Environments from "../configurations/Environments.ts";
import GuildManager from "../guild/GuildManager.ts";
import GuildRepository from "../guild/GuildRepository.ts";
import AbsolutePath from "../utilities/AbsolutePath.ts";
import DependencyLoader from "../utilities/DependencyLoader.ts";
import Logger from "../utilities/Logger.ts";
import { RetryAsyncCallback } from "../utilities/RetryCallback.ts";

class ClientManager {
	private static mInstance: ClientManager;

	private mDiscordClient: Client;
	private mCommands: Record<string, GroupCommand>;
	private mServers: Record<string, GuildManager>;
	private mAi: AIManager;

	private constructor(discordClient: Client) {
		this.mDiscordClient = discordClient;
		this.mCommands = {};
		this.mServers = {};
		this.mAi = new AIManager(Environments.AI_CONNECTION);
	}

	public static Create(discordClient: Client) {
		if (!ClientManager.mInstance) {
			ClientManager.mInstance = new ClientManager(discordClient);
		} else {
			Logger.warning("Bot has already been created");
		}

		return ClientManager.mInstance;
	}

	public static get instance() {
		if (!ClientManager.mInstance) {
			throw new Error("Bot has not been created yet");
		}

		return ClientManager.mInstance;
	}

	public get name() {
		return this.mDiscordClient.user?.username;
	}

	public get AIManger() {
		return this.mAi;
	}

	private AddEvent<T extends keyof ClientEvents>(
		event: ClientEvent<T>,
	): void {
		this.mDiscordClient.on(
			event.name,
			event.listener({
				commands: this.mCommands,
				CreateGuildManager: this.AddGuildManager.bind(this),
				DeleteGuildManager: this.DeleteGuildManager.bind(this),
			}),
		);
	}

	public async LoadEvents() {
		const loadedEvents = await DependencyLoader(
			path.join(AbsolutePath(import.meta.url), "events"),
			false,
		);

		for (const { default: event } of loadedEvents) {
			if (event instanceof ClientEvent) {
				Logger.information(`Loaded event ${event.name}`);
				this.AddEvent(event);
			} else {
				Logger.warning(`An event is missing`);
			}
		}
	}

	public AddGroupCommand(groupCommand: GroupCommand) {
		this.mCommands[groupCommand.metadata.name] = groupCommand;
	}

	public async UpdateCommands() {
		const rest = new REST().setToken(Environments.CLIENT_TOKEN);
		const commandsMetadata = Object.values(this.mCommands).map(
			(command) => {
				return command.metadata;
			},
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		await RetryAsyncCallback(3, async () => {
			await rest.put(
				Routes.applicationCommands(Environments.APPLICATION_ID),
				{
					body: commandsMetadata,
				},
			);
		});
	}

	public async AddGuildManager(guild: Guild) {
		this.mServers[guild.id] = new GuildManager(
			guild,
			new AudioPlayer(),
			new GuildRepository(),
		);

		await this.mServers[guild.id].LoadEvents();
		await this.mServers[guild.id].LoadCache();
	}

	public GetGuildManager(serverId: string) {
		return this.mServers[serverId];
	}

	public async DeleteGuildManager(serverId: string) {
		await this.mServers[serverId].Delete();
		delete this.mServers[serverId];
	}

	public async Run() {
		await RetryAsyncCallback(3, async () => {
			await this.mDiscordClient.login(Environments.CLIENT_TOKEN);
		});

		const guildsPromiseArray: any[] = [];

		for (const guild of this.mDiscordClient.guilds.cache.values()) {
			guildsPromiseArray.push(this.AddGuildManager(guild));
		}

		await Promise.all(guildsPromiseArray);

		this.mAi.Connect();

		console.clear();
		Logger.information(`${this.name} is ready to go!`);
	}
}

export default ClientManager;
