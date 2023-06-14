import { ClientEvents, Events, Awaitable } from "discord.js";

abstract class BotEvent<T extends keyof ClientEvents> {
	protected mName: keyof ClientEvents;

	constructor(name: keyof ClientEvents) {
		this.mName = name;
	}

	public abstract listener(
		context: any,
		...args: ClientEvents[T]
	): Awaitable<void>;

	public get name() {
		return this.mName;
	}
}

export default BotEvent;
