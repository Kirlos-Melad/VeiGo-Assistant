import { Awaitable } from "discord.js";
import {
	AudioPlayerEventKeys,
	AudioPlayerEvents,
	AudioPlayerEventHandlers,
} from "../audio/AudioPlayerEvent";

abstract class AudioPlayerEvent<T extends AudioPlayerEventKeys> {
	protected mName: T;

	constructor(name: T) {
		this.mName = name;
	}

	public abstract listener(context: unknown): AudioPlayerEventHandlers[T];

	public get name() {
		return this.mName;
	}
}

export default AudioPlayerEvent;
