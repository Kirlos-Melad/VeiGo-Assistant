// Libraries
import {
	search as audioSearch,
	stream as urlStream,
	video_basic_info,
	validate as validateUrl,
	YouTube,
	Spotify,
	SoundCloud,
	Deezer,
	YouTubeChannel,
	YouTubeVideo,
} from "play-dl";
import {
	createAudioPlayer,
	createAudioResource,
	AudioPlayer as DiscordAudioPlayer,
	AudioPlayerStatus,
	NoSubscriberBehavior,
} from "@discordjs/voice";
import { Awaitable } from "discord.js";
import { TypedEmitter } from "tiny-typed-emitter";

// Modules
import Queue from "../utilities/Queue.ts";
import Audio from "./IAudio.ts";
import LoggerService from "../services/Logger.service.ts";

//! This is copied directly from the play-dl documentation as it is not exported.
interface SearchOptions {
	limit?: number;
	source?: {
		youtube?: "video" | "playlist" | "channel";
		spotify?: "album" | "playlist" | "track";
		soundcloud?: "tracks" | "playlists" | "albums";
		deezer?: "track" | "playlist" | "album";
	};
	fuzzy?: boolean;
	language?: string;
	/**
	 * !!! Before enabling this for public servers, please consider using Discord features like NSFW channels as not everyone in your server wants to see NSFW images. !!!
	 * Unblurred images will likely have different dimensions than specified in the {@link YouTubeThumbnail} objects.
	 */
	unblurNSFWThumbnails?: boolean;
}

type AudioPlayerEvents = {
	SEARCH_AUDIO: [
		query: string,
		results: Array<YouTube | SoundCloud | Spotify | Deezer>,
	];

	ADD_AUDIO: [queue: Queue<Audio>, audio: Audio];

	PLAY_AUDIO: [queue: Queue<Audio>, audio: Audio];
	FINISH_AUDIO: [queue: Queue<Audio>, audio: Audio];

	SKIP_AUDIO: [queue: Queue<Audio>, audio: Audio];

	PAUSE_AUDIO: [queue: Queue<Audio>, audio: Audio];
	RESUME_AUDIO: [queue: Queue<Audio>, audio: Audio];

	EMPTY_QUEUE: [queue: Queue<Audio>];

	DESTROY_QUEUE: [queue: Queue<Audio>];

	ERROR: [error: any];
};

type AudioPlayerEventKeys = keyof AudioPlayerEvents;

type AudioPlayerEventHandlers = {
	[K in AudioPlayerEventKeys]: (
		...args: AudioPlayerEvents[K]
	) => Awaitable<void>;
};

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
			this.mPlayer.stop(true);
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
			source: {
				youtube: "video",
			},
		};

		const searchResults = await audioSearch(query, options);

		this.emit("SEARCH_AUDIO", query, searchResults);

		return searchResults;
	}

	private CreateAudio(information: YouTube | SoundCloud | Spotify | Deezer) {
		let audio: Audio | null;

		const defaultAudioName = "Audio";
		const defaultAudioThumbnail =
			"https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcommunity.spotify.com%2Ft5%2Fimage%2Fserverpage%2Fimage-id%2F25294i2836BD1C1A31BDF2%3Fv%3Dv2&f=1&nofb=1&ipt=f1a554b5eeb7836d5f649ac8dfa1d8213f65ba1f712575195f7d1b1f08cff728&ipo=images";

		if (information instanceof YouTubeVideo) {
			audio = {
				name: information.title || defaultAudioName,
				url: information.url,
				thumbnail:
					information.thumbnails[0]?.url || defaultAudioThumbnail,
				duration: information.durationRaw,
			};
		} else {
			audio = null;
			this.emit("ERROR", {
				name: "Invalid audio",
				message: "Supported audio: ['YoutubeVideo']",
			});
		}

		return audio;
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
		let results: Array<
			Exclude<YouTube | SoundCloud | Spotify | Deezer, YouTubeChannel>
		>;
		const validationResult = await validateUrl(query);
		if (validationResult === "search") results = await this.Search(query);
		else if (validationResult === "yt_video")
			results = [(await video_basic_info(query)).video_details];
		else {
			this.emit("ERROR", {
				name: "Invalid URL or search query",
				message: `${query} is not a valid URL or search query}`,
			});
			return;
		}

		if (results.length === 0 || !results[0]) return;

		//TODO: Enhance the audio selection process
		const audio = this.CreateAudio(results[0]);

		if (!audio) return;

		this.AddAudio(audio);

		if (this.mPlayer.state.status !== AudioPlayerStatus.Idle) return;

		//? Move to the next audio if the current audio is IDLE ONLY
		if (this.mQueue.Peek()) this.mQueue.Next();
		this.PlayAudio(audio);
	}

	public Skip() {
		if (this.mPlayer.state.status !== AudioPlayerStatus.Playing) return;

		this.emit("SKIP_AUDIO", this.mQueue, this.mQueue.First());
		this.mPlayer.stop();
	}

	public Pause() {
		if (this.mPlayer.state.status !== AudioPlayerStatus.Playing) return;

		const isPaused = this.mPlayer.pause();
		if (isPaused)
			this.emit("PAUSE_AUDIO", this.mQueue, this.mQueue.First());
	}

	public Resume() {
		if (this.mPlayer.state.status !== AudioPlayerStatus.Paused) return;

		const isResumed = this.mPlayer.unpause();
		if (isResumed)
			this.emit("RESUME_AUDIO", this.mQueue, this.mQueue.First());
	}

	public Stop() {
		this.mPlayer.stop(true);
		this.mQueue.Clear();
	}

	/**
	 * @returns DiscordAudioPlayer instance
	 */
	public get player() {
		return this.mPlayer;
	}
}

export default AudioPlayer;
export { AudioPlayerEventKeys, AudioPlayerEventHandlers };
