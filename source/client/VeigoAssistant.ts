import {
	Client,
	GatewayIntentBits,
	REST,
	Routes,
	ClientEvents,
} from "discord.js";
import DependencyLoader from "../utilities/DependencyLoader.js";
import BotEvent from "../classes/BotEvent.js";
import Command from "../classes/Command.js";

import { DisTube, DisTubeError, GuildIdResolvable, Queue, Song } from "distube";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import MusicPlayerEvent from "../classes/MusicPlayerEvent.js";
import { RetryAsyncCallback } from "../utilities/RetryCallback.js";

class Bot extends Client {
	private mCommands: Record<string, Command>;
	private mMusicPlayer: DisTube;

	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildVoiceStates,
			],
		});

		this.mCommands = {};

		this.mMusicPlayer = new DisTube(this, {
			searchSongs: 1,
			searchCooldown: 30,
			emitNewSongOnly: false,
			plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
		});
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

	private async AssignEvents(event: any) {
		if (event instanceof BotEvent) {
			this.on(event.name, (...args: ClientEvents[]) => {
				event.listener({ commands: this.mCommands }, ...args);
			});
		} else if (event instanceof MusicPlayerEvent) {
			this.mMusicPlayer.on(event.name, event.listener);
		} else {
			console.log(`[WARNING] An event is missing`);
		}
	}

	public async LoadEvents(directory: string, recursive?: boolean) {
		const loadedEvents = await DependencyLoader(directory, recursive);

		for (const eventImports of loadedEvents) {
			const { default: event } = eventImports;

			this.AssignEvents(event);
		}
	}

	public async Run() {
		RetryAsyncCallback(
			3,
			async () => await this.login(process.env.CLIENT_TOKEN),
		);
	}

	public get musicPlayer() {
		return {
			//! Functions must be bound to the class instance or else they will not work
			play: this.mMusicPlayer.play.bind(this.mMusicPlayer),
			stop: this.mMusicPlayer.stop.bind(this.mMusicPlayer),
			skip: async (guildId: GuildIdResolvable) => {
				try {
					const song = await this.mMusicPlayer.skip(guildId);

					return song;
				} catch (error) {
					if (
						error instanceof DisTubeError &&
						error.code === "NO_UP_NEXT"
					) {
						const song =
							this.mMusicPlayer.getQueue(guildId)!.songs[0];
						await this.mMusicPlayer.stop(guildId);

						return song;
					} else throw error;
				}
			},
			pause: this.mMusicPlayer.pause.bind(this.mMusicPlayer),
			resume: this.mMusicPlayer.resume.bind(this.mMusicPlayer),
			hasQueue: (guildId: GuildIdResolvable) => {
				return this.mMusicPlayer.getQueue(guildId) != undefined;
			},
			//AddToQueue: this.mMusicPlayer.addToQueue.bind(this.mMusicPlayer),
			search: this.mMusicPlayer.search.bind(this.mMusicPlayer),
		};
	}
}

export default new Bot();
