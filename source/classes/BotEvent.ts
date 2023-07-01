import { ClientEvents, Events, Awaitable, Client } from "discord.js";

abstract class BotEvent<T extends keyof ClientEvents> {
	protected mName: T;

	constructor(name: T) {
		this.mName = name;
	}

	public abstract listener(
		context: unknown,
	): (...args: ClientEvents[T]) => Awaitable<void>;

	public get name() {
		return this.mName;
	}
}

export default BotEvent;
