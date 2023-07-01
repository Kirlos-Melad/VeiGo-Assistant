import {
	InternalDiscordGatewayAdapterCreator,
	TextBasedChannel,
} from "discord.js";
import { VoiceConnection, joinVoiceChannel } from "@discordjs/voice";

import AudioPlayer from "./AudioPlayer.js";
import PlayEvent from "./events/Play.event.js";
import Queue from "../utilities/Queue.js";
import Audio from "./@types/Audio.js";
import { AudioPlayerEventKeys, AudioPlayerEvents } from "./AudioPlayerEvent.js";
import AudioPlayerEvent from "../classes/AudioEvents.js";

class AudioPlayerManager {
	private mServerId: string;
	private mAdapterCreator: InternalDiscordGatewayAdapterCreator;
	private mAudioPlayer: AudioPlayer;

	private mTextChannelId: TextBasedChannel | null;
	private mVoiceChannelId: string | null;
	private mVoiceConnection: VoiceConnection | null;

	constructor(
		serverId: string,
		serverVoiceAdapter: InternalDiscordGatewayAdapterCreator,
	) {
		this.mServerId = serverId;
		this.mAdapterCreator = serverVoiceAdapter;
		this.mAudioPlayer = new AudioPlayer();

		this.mTextChannelId = null;
		this.mVoiceChannelId = null;
		this.mVoiceConnection = null;
	}

	public get audioPlayer() {
		return this.mAudioPlayer;
	}

	AddListener<T extends AudioPlayerEventKeys>(
		event: AudioPlayerEvent<T>,
	): void {
		this.mAudioPlayer.on(
			event.name,
			event.listener({ textChannel: this.mTextChannelId }),
		);
	}

	AddListeners<T extends AudioPlayerEventKeys>(
		events: AudioPlayerEvent<T>[],
	): void {
		for (const event of events) {
			this.AddListener(event);
		}
	}

	public SetTextChannel(channelId: TextBasedChannel) {
		this.mTextChannelId = channelId;
	}

	public JoinVoiceChannel(channelId: string) {
		this.mVoiceChannelId = channelId;
		this.mVoiceConnection = joinVoiceChannel({
			guildId: this.mServerId,
			channelId: this.mVoiceChannelId,
			adapterCreator: this.mAdapterCreator,
		});

		this.mVoiceConnection.subscribe;
		this.mVoiceConnection.subscribe(this.mAudioPlayer.player);
	}

	public DisconnectFromVoiceChannel() {
		this.mVoiceConnection?.destroy();

		this.mVoiceChannelId = null;
		this.mVoiceConnection = null;
	}
}

export default AudioPlayerManager;
