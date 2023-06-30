import { StreamType } from "@discordjs/voice";
import { Readable } from "stream";

interface Audio {
	url: string;
	title: string;
	thumbnail: string;
	duration: string;

	stream: Readable;
	streamType: StreamType;
}

export default Audio;
