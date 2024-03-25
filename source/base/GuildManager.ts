import { Guild, TextBasedChannel } from "discord.js";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import path from "path";

import AudioPlayer, { AudioPlayerEventKeys } from "../audio/AudioPlayer.ts";
import AudioPlayerEvent from "./AudioEvents.ts";
import DependencyLoader from "../utilities/DependencyLoader.ts";
import __dirname from "../utilities/__dirname.ts";
import Logger from "../utilities/Logger.ts";

type GuildConfigurations = {
	communicationChannelId?: string | null;
};

class GuildManager {
	private mGuild: Guild;

	// private mGuildId: string;
	// private mAdapterCreator: InternalDiscordGatewayAdapterCreator;
	private mAudioPlayer: AudioPlayer;

	private mCommunicationChannel: TextBasedChannel | null;

	constructor(
		guild: Guild,
		audioPlayer: AudioPlayer,
		configurations: GuildConfigurations = {},
	) {
		this.mGuild = guild;
		this.mAudioPlayer = audioPlayer;

		const { communicationChannelId } = configurations;

		const communicationChannel = communicationChannelId
			? (guild.channels.cache.get(
					communicationChannelId,
			  ) as TextBasedChannel)
			: null;

		this.mCommunicationChannel = communicationChannel ?? null;
	}

	public get audioPlayer() {
		return this.mAudioPlayer;
	}

	public get communicationChannel(): TextBasedChannel | null {
		return this.mCommunicationChannel;
	}

	public set communicationChannel(channel: TextBasedChannel | null) {
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
				Logger.information(`Loaded event ${event.name}`);
				this.AddEvent(event);
			} else {
				Logger.warning(`An event is missing`);
			}
		}
	}

	public JoinVoiceChannel(channelId: string) {
		const connection = joinVoiceChannel({
			guildId: this.mGuild.id,
			channelId: channelId,
			adapterCreator: this.mGuild.voiceAdapterCreator,
		});

		connection.subscribe(this.mAudioPlayer.player);
		connection.on("stateChange", (oldState, newState) => {
			if (newState.status === "disconnected") {
				connection.destroy(true);
			}
		});
	}

	public DisconnectFromVoiceChannel() {
		const connection = getVoiceConnection(this.mGuild.id);

		connection?.destroy();
	}
}

export default GuildManager;
export type { GuildConfigurations };
