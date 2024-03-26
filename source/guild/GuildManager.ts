import { Guild, TextBasedChannel } from "discord.js";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import path from "path";

import AudioPlayer, { AudioPlayerEventKeys } from "../audio/AudioPlayer.ts";
import AudioPlayerEvent from "../base/AudioEvents.ts";
import DependencyLoader from "../utilities/DependencyLoader.ts";
import __dirname from "../utilities/__dirname.ts";
import Logger from "../utilities/Logger.ts";
import GuildRepository from "./GuildRepository.ts";

type GuildConfigurations = {
	communicationChannelId?: string | null;
};

class GuildManager {
	private mGuild: Guild;

	// private mAdapterCreator: InternalDiscordGatewayAdapterCreator;
	private mAudioPlayer: AudioPlayer;
	private mRepository: GuildRepository;

	private mCommunicationChannel: TextBasedChannel | undefined;

	constructor(
		guild: Guild,
		audioPlayer: AudioPlayer,
		repository: GuildRepository,
	) {
		this.mGuild = guild;
		this.mAudioPlayer = audioPlayer;
		this.mRepository = repository;
		this.mCommunicationChannel = undefined;
	}

	public get audioPlayer() {
		return this.mAudioPlayer;
	}

	public GetCommunicationChannel(): TextBasedChannel | undefined {
		return this.mCommunicationChannel;
	}

	public async SetCommunicationChannel(
		channel: TextBasedChannel | undefined,
	) {
		this.mCommunicationChannel = channel;
		await this.mRepository.Update(
			{ id: this.mGuild.id },
			{ communicationChannelId: channel?.id },
		);
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

	public async LoadCache() {
		const result = await this.mRepository.Read({ id: this.mGuild.id });

		await this.SetCommunicationChannel(
			result?.communicationChannelId
				? (this.mGuild.channels.cache.get(
						result.communicationChannelId,
				  ) as TextBasedChannel | undefined)
				: undefined,
		);
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

	public async Delete() {
		this.DisconnectFromVoiceChannel();
		await this.mRepository.Delete({ id: this.mGuild.id });
	}
}

export default GuildManager;
export type { GuildConfigurations };
