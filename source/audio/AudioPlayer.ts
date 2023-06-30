// Libraries
//import youtubeStreamer from "ytdl-core";
import { search as audioSearch, search, stream as urlStream } from "play-dl";
import {
	createAudioPlayer,
	createAudioResource,
	AudioPlayer as DiscordAudioPlayer,
	AudioPlayerStatus,
	NoSubscriberBehavior,
	demuxProbe,
} from "@discordjs/voice";

// Modules
import Queue from "./Queue.js";
import Audio from "./@types/Audio.js";

class AudioPlayer {
	private mQueue: Queue<Audio>;
	private mPlayer: DiscordAudioPlayer;

	constructor() {
		this.mQueue = new Queue<Audio>({});
		this.mPlayer = createAudioPlayer({
			behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
		});
	}

	private async Search(query: string) {
		const [searchResult] = await audioSearch(query, {
			limit: 1,
			//source: { youtube: "video" },
		});

		if (!searchResult) throw new Error("No results found.");

		const { type, stream } = await urlStream(searchResult.url);

		const audio: Audio = {
			title: searchResult.title!,
			url: searchResult.url,
			thumbnail: searchResult.thumbnails[0]!.url,
			duration: searchResult.durationRaw,

			stream: stream,
			streamType: type,
		};

		return audio;
	}

	private async AddAudio(audio: Audio) {
		this.mQueue.Append(audio);
	}

	public async Play(query: string) {
		const audio = await this.Search(query);
		this.AddAudio(audio);

		if (this.mPlayer.state.status !== AudioPlayerStatus.Idle) return;

		const audioResource = createAudioResource(audio.stream, {
			inputType: audio.streamType,
		});

		//TODO: check the state of the controller then act accordingly
		this.mPlayer.play(audioResource);
	}

	public get player() {
		return this.mPlayer;
	}
}

export default AudioPlayer;
