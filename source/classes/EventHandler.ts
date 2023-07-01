abstract class EventHandler {
	public abstract AddEvent<T, U>(event: T, listener: U): void;
}
