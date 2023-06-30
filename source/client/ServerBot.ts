import { InternalDiscordGatewayAdapterCreator } from "discord.js";
import { VoiceConnection, joinVoiceChannel } from "@discordjs/voice";

import AudioPlayer from "../audio/AudioPlayer.js";

class ServerBot {
	private mServerId: string;
	private mAdapterCreator: InternalDiscordGatewayAdapterCreator;
	private mAudioPlayer: AudioPlayer;

	private mVoiceChannelId: string | null;
	private mVoiceConnection: VoiceConnection | null;

	constructor(
		serverId: string,
		serverVoiceAdapter: InternalDiscordGatewayAdapterCreator,
	) {
		this.mServerId = serverId;
		this.mAdapterCreator = serverVoiceAdapter;
		this.mAudioPlayer = new AudioPlayer();
		this.mVoiceChannelId = null;
		this.mVoiceConnection = null;
	}

	public get audioPlayer() {
		return this.mAudioPlayer;
	}

	public JoinVoiceChannel(channelId: string) {
		this.mVoiceChannelId = channelId;
		this.mVoiceConnection = joinVoiceChannel({
			guildId: this.mServerId,
			channelId: this.mVoiceChannelId,
			adapterCreator: this.mAdapterCreator,
		});

		this.mVoiceConnection.subscribe
		this.mVoiceConnection.subscribe(this.mAudioPlayer.player);
	}

	public DisconnectFromVoiceChannel() {
		this.mVoiceConnection?.destroy();

		this.mVoiceChannelId = null;
		this.mVoiceConnection = null;
	}
}

export default ServerBot;
