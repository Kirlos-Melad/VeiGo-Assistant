import { EmbedFooterOptions } from "discord.js";
import {
	AudioPlayerEventHandlers,
	AudioPlayerEventKeys,
} from "../audio/AudioPlayer.ts";
import Environments from "../configurations/Environments.ts";

abstract class AudioPlayerEvent<T extends AudioPlayerEventKeys> {
	private mName: T;
	protected mEmbedFooterOptions: EmbedFooterOptions;

	constructor(name: T) {
		this.mName = name;
		this.mEmbedFooterOptions = {
			text: Environments.AUTHOR_SIGNATURE,
			iconURL: Environments.AUTHOR_IMAGE_URL,
		};
	}

	public abstract listener(context: unknown): AudioPlayerEventHandlers[T];

	public get name() {
		return this.mName;
	}
}

export default AudioPlayerEvent;
