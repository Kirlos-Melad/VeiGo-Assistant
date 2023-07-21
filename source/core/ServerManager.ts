import {
	CommandInteraction,
	Guild,
	TextBasedChannel,
} from "discord.js";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import path from "path";

import AudioPlayer, { AudioPlayerEventKeys } from "../audio/AudioPlayer.ts";
import AudioPlayerEvent from "../classes/AudioEvents.ts";
import DependencyLoader from "../utilities/DependencyLoader.ts";
import __dirname from "../utilities/__dirname.ts";
import LoggerService from "../services/Logger.service.ts";

class ServerManager {
	private mServer: Guild;

	// private mServerId: string;
	// private mAdapterCreator: InternalDiscordGatewayAdapterCreator;
	private mAudioPlayer: AudioPlayer;

	private mCommunicationChannel?: TextBasedChannel;

	private mCommandInteraction?: CommandInteraction;

	constructor(server: Guild) {
		this.mServer = server;
		this.mAudioPlayer = new AudioPlayer();
	}

	public get audioPlayer() {
		return this.mAudioPlayer;
	}

	public get communicationChannel() {
		return this.mCommunicationChannel;
	}

	public set communicationChannel(channel: TextBasedChannel | undefined) {
		this.mCommunicationChannel = channel;
	}

	private AddEvent<T extends AudioPlayerEventKeys>(
		event: AudioPlayerEvent<T>,
	): void {
		this.mAudioPlayer.on(event.name, event.listener(this));
	}

	public async LoadEvents() {
		const loadedEvents = await DependencyLoader(
			path.join(__dirname(import.meta.url), "..", "audio", "events"),
			true,
		);

		for (const { default: event } of loadedEvents) {
			if (event instanceof AudioPlayerEvent) {
				LoggerService.information(`Loaded event ${event.name}`);
				this.AddEvent(event);
			} else {
				LoggerService.warning(`[WARNING] An event is missing`);
			}
		}
	}

	public get commandInteraction(): CommandInteraction | undefined {
		return this.mCommandInteraction;
	}

	public set commandInteraction(
		commandInteraction: CommandInteraction | undefined,
	) {
		this.mCommandInteraction = commandInteraction;
	}

	public JoinVoiceChannel(channelId: string) {
		const connection = joinVoiceChannel({
			guildId: this.mServer.id,
			channelId: channelId,
			adapterCreator: this.mServer.voiceAdapterCreator,
		});

		connection.subscribe(this.mAudioPlayer.player);
		connection.on("stateChange", (oldState, newState) => {
			if (newState.status === "disconnected") {
				connection.destroy(true);
			}
		});
	}

	public DisconnectFromVoiceChannel() {
		const connection = getVoiceConnection(this.mServer.id);

		connection?.destroy();
	}
}

export default ServerManager;
