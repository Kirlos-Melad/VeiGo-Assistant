// Libraries
import {
	search as audioSearch,
	stream as urlStream,
	video_basic_info,
	validate as validateUrl,
} from "play-dl";
import {
	createAudioPlayer,
	createAudioResource,
	AudioPlayer as DiscordAudioPlayer,
	AudioPlayerStatus,
	NoSubscriberBehavior,
} from "@discordjs/voice";
import { TypedEmitter } from "tiny-typed-emitter";

// Modules
import Queue from "../utilities/Queue.js";
import Audio from "./@types/Audio.js";
import {
	AudioPlayerEventKeys,
	AudioPlayerEventHandlers,
} from "./AudioPlayerEvent.js";
import LoggerService from "../services/Logger.service.js";

type SearchOptions = { limit?: number };

class AudioPlayer extends TypedEmitter<AudioPlayerEventHandlers> {
	private mQueue: Queue<Audio>;
	private mPlayer: DiscordAudioPlayer;

	constructor() {
		super();

		this.mQueue = new Queue<Audio>();
		this.mPlayer = this.InitializePlayer();
	}

	private InitializePlayer() {
		const player = createAudioPlayer({
			behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
		});

		player.on("stateChange", (oldState, newState) => {
			if (
				oldState.status === AudioPlayerStatus.Playing &&
				newState.status === AudioPlayerStatus.Idle
			) {
				this.emit("FINISH_AUDIO", this.mQueue, this.mQueue.First());

				if (this.mQueue.Peek()) {
					const audio = this.mQueue.Next();
					this.PlayAudio(audio);
				} else {
					this.emit("EMPTY_QUEUE", this.mQueue);
				}
			}
		});

		player.on("error", (error) => {
			this.emit("ERROR", error);
		});

		player.on("unsubscribe", (subscription) => {
			this.emit("DESTROY_QUEUE", this.mQueue);
			this.mPlayer.stop();
			this.mQueue.Clear();
		});

		player.on("debug", (message) => {
			LoggerService.information(message);
		});

		return player;
	}

	/**
	 * Search for audio
	 */
	private async Search(query: string, options?: SearchOptions) {
		options = {
			...options,
			// Default limit is 1 if not specified or is less than 1
			limit: options?.limit && options.limit > 0 ? options.limit : 1,
		};

		const searchResults = await audioSearch(query, options);
		console.log(searchResults);

		this.emit("SEARCH_AUDIO", query, searchResults);

		return searchResults;
	}

	private async AddAudio(audio: Audio) {
		this.mQueue.Append(audio);
		this.emit("ADD_AUDIO", this.mQueue, audio);
	}

	private async PlayAudio(audio: Audio) {
		const { type, stream } = await urlStream(audio.url);
		const audioResource = createAudioResource(stream, {
			inputType: type,
		});

		this.emit("PLAY_AUDIO", this.mQueue, audio);
		//TODO: check the state of the controller then act accordingly
		this.mPlayer.play(audioResource);
	}

	/**
	 * @param query The search query or URL
	 *
	 *
	 */
	public async Play(query: string) {
		let results;
		if (!(await validateUrl(query))) results = await this.Search(query);
		else results = [(await video_basic_info(query)).video_details];

		//TODO: Enhance the audio selection process
		const audio: Audio = {
			title: results[0]!.title!,
			url: results[0]!.url,
			thumbnail: results[0]!.thumbnails[0]!.url,
			duration: results[0]!.durationRaw,
		};

		this.AddAudio(audio);

		if (this.mPlayer.state.status !== AudioPlayerStatus.Idle) return;

		this.PlayAudio(audio);
	}

	/**
	 * @returns DiscordAudioPlayer instance
	 */
	public get player() {
		return this.mPlayer;
	}
}

export default AudioPlayer;
