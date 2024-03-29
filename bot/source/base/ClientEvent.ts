import { ClientEvents, Awaitable } from "discord.js";

abstract class ClientEvent<T extends keyof ClientEvents> {
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

export default ClientEvent;
