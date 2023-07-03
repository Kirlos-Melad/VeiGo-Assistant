import {
	InteractionEditReplyOptions,
	InternalDiscordGatewayAdapterCreator,
	Message,
	MessagePayload,
	TextBasedChannel,
} from "discord.js";
import { VoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import path from "path";

import AudioPlayer from "./AudioPlayer.js";
import { AudioPlayerEventKeys } from "./AudioPlayerEvent.js";
import AudioPlayerEvent from "../classes/AudioEvents.js";
import DependencyLoader from "../utilities/DependencyLoader.js";
import __dirname from "../utilities/__dirname.js";
import LoggerService from "../services/Logger.service.js";

class AudioPlayerManager {
	private mServerId: string;
	private mAdapterCreator: InternalDiscordGatewayAdapterCreator;
	private mAudioPlayer: AudioPlayer;

	private mVoiceChannelId: string | null;
	private mVoiceConnection: VoiceConnection | null;

	private mTextChannel: TextBasedChannel | null;
	private mEditReply:
		| ((
				options: string | MessagePayload | InteractionEditReplyOptions,
		  ) => Promise<Message<boolean>>)
		| null;

	constructor(
		serverId: string,
		serverVoiceAdapter: InternalDiscordGatewayAdapterCreator,
	) {
		this.mServerId = serverId;
		this.mAdapterCreator = serverVoiceAdapter;
		this.mAudioPlayer = new AudioPlayer();

		this.mVoiceChannelId = null;
		this.mVoiceConnection = null;

		this.mTextChannel = null;
		this.mEditReply = null;
	}

	public get audioPlayer() {
		return this.mAudioPlayer;
	}

	private AddEvent<T extends AudioPlayerEventKeys>(
		event: AudioPlayerEvent<T>,
	): void {
		this.mAudioPlayer.on(event.name, event.listener(this));
	}

	public async LoadEvents() {
		const loadedEvents = await DependencyLoader(
			path.join(__dirname(import.meta.url), "events"),
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

	/**
	 * @description Sets the context for the audio player
	 * Must be called before any audio can be played to work correctly
	 *
	 * @param textChannel The channel to send messages to
	 * @param editReply The function to edit the reply message from the bot
	 */
	public SetContext(context: {
		editReply:
			| ((
					options:
						| string
						| MessagePayload
						| InteractionEditReplyOptions,
			  ) => Promise<Message<boolean>>)
			| null;
		textChannel: TextBasedChannel | null;
	}) {
		this.mTextChannel = context.textChannel;
		this.mEditReply = context.editReply;
	}

	public GetContext() {
		return {
			textChannel: this.mTextChannel,
			editReply: this.mEditReply,
		};
	}

	public JoinVoiceChannel(channelId: string) {
		this.mVoiceChannelId = channelId;
		this.mVoiceConnection = joinVoiceChannel({
			guildId: this.mServerId,
			channelId: this.mVoiceChannelId,
			adapterCreator: this.mAdapterCreator,
		});

		this.mVoiceConnection.subscribe(this.mAudioPlayer.player);
	}

	public DisconnectFromVoiceChannel() {
		this.mVoiceConnection?.destroy();

		this.mVoiceChannelId = null;
		this.mVoiceConnection = null;
	}
}

export default AudioPlayerManager;
