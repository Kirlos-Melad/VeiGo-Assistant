import { AIManagerEventHandlers, AIManagerEventKeys } from "../ai/AIManager";

type Resolve<U> = (value: U) => void;
type Reject = (reason?: any) => void;

abstract class AIEvent<T extends AIManagerEventKeys> {
	protected mName: T;

	constructor(name: T) {
		this.mName = name;
	}

	public abstract listener(
		resolve: Resolve<unknown>,
		reject: Reject,
	): AIManagerEventHandlers[T];

	public get name() {
		return this.mName;
	}
}

export default AIEvent;
export type { Resolve, Reject };
