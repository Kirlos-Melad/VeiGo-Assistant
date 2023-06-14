import {
	Client,
	GatewayIntentBits,
	REST,
	Routes,
	ClientEvents,
	BitField,
	BitFieldResolvable,
	GatewayIntentsString,
} from "discord.js";
import DependencyLoader from "../utilities/DependencyLoader.js";
import BotEvent from "../classes/BotEvent.js";
import Command from "../classes/Command.js";

import { DisTube } from "distube";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";

class Bot {
	private static sInstance: Bot;

	private mClient: Client;
	private mCommands: Record<string, Command>;
	private mMusicPlayer: DisTube;

	private constructor(client: Client) {
		this.mClient = client;
		const intents = new BitField<GatewayIntentsString>();
		intents.add(
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildIntegrations,
			GatewayIntentBits.GuildVoiceStates,
		);
		this.mClient.options.intents = intents;

		this.mCommands = {};

		this.mMusicPlayer = new DisTube(client, {
			searchSongs: 5,
			searchCooldown: 30,
			leaveOnEmpty: false,
			leaveOnFinish: false,
			leaveOnStop: false,
			plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
		});
	}

	public static CreateInstance(client: Client) {
		if (this.sInstance) throw new Error("Bot instance already exists");
		else this.sInstance = new Bot(client);
		return this.sInstance;
	}

	public static get instance() {
		return this.sInstance;
	}

	public async LoadCommands(directory: string, recursive?: boolean) {
		const loadedCommands = await DependencyLoader(directory, recursive);

		for (const commandImports of loadedCommands) {
			const { default: command } = commandImports;
			if (command instanceof Command) {
				this.mCommands[command.metadata.name] = command;
			} else {
				console.log(`[WARNING] A command is missing`);
			}
		}

		const rest = new REST().setToken(process.env.CLIENT_TOKEN!);
		const commandValues = Object.values(this.mCommands);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.APPLICATION_ID!),
			{
				body: commandValues.map((command) => {
					return command.metadata;
				}),
			},
		);
	}

	public async LoadEvents(directory: string, recursive?: boolean) {
		const loadedEvents = await DependencyLoader(directory, recursive);

		for (const eventImports of loadedEvents) {
			const { default: event } = eventImports;

			if (event instanceof BotEvent) {
				this.mClient.on(
					event.name,
					(...args: ClientEvents[typeof event.name]) => {
						event.listener({ commands: this.mCommands }, ...args);
					},
				);
			} else {
				console.log(`[WARNING] An event is missing`);
			}
		}
	}

	public async Run() {
		await this.mClient.login(process.env.CLIENT_TOKEN);
	}

	public get musicPlayer() {
		return {
			//! Functions must be bound to the class instance or else they will not work
			play: this.mMusicPlayer.play.bind(this.mMusicPlayer),
		};
	}
}

export default Bot;
