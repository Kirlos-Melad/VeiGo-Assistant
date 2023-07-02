import { Deezer, SoundCloud, Spotify, YouTube } from "play-dl";

import Audio from "./@types/Audio.js";
import Queue from "../utilities/Queue.js";
import { Awaitable } from "discord.js";

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

export { AudioPlayerEvents, AudioPlayerEventKeys, AudioPlayerEventHandlers };
