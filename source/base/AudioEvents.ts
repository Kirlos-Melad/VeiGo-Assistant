import { EmbedFooterOptions } from "discord.js";
import {
	AudioPlayerEventHandlers,
	AudioPlayerEventKeys,
} from "../audio/AudioPlayer.ts";

abstract class AudioPlayerEvent<T extends AudioPlayerEventKeys> {
	protected mName: T;
	protected mEmbedFooterOptions: EmbedFooterOptions;

	constructor(name: T) {
		this.mName = name;
		this.mEmbedFooterOptions = {
			text: "Developed by Veigo 😎🔥",
			iconURL: "https://avatars.githubusercontent.com/u/52179817?v=4",
		};
	}

	public abstract listener(context: unknown): AudioPlayerEventHandlers[T];

	public get name() {
		return this.mName;
	}
}

export default AudioPlayerEvent;
