import { TypedDisTubeEvents } from "distube";

abstract class MusicPlayerEvent<T extends keyof TypedDisTubeEvents> {
	protected mName: T;

	constructor(name: T) {
		this.mName = name;
	}

	public abstract listener: TypedDisTubeEvents[T];

	public get name() {
		return this.mName;
	}
}

export default MusicPlayerEvent;
