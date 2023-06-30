type QueueOptions<T = unknown> = {
	queue?: T[];
	loop?: boolean;
};

class Queue<T = unknown> {
	private mQueue: T[];
	private mLoop: boolean;
	private mCursor: number;

	constructor(options: QueueOptions<T>);
	constructor(queue: T[], options?: Omit<QueueOptions<T>, "queue">);
	constructor(
		queueOrOptions: T[] | QueueOptions<T>,
		options?: Omit<QueueOptions<T>, "queue">,
	) {
		if (Array.isArray(queueOrOptions)) {
			this.mQueue = queueOrOptions;
			this.mLoop = options?.loop ?? false;
		} else {
			this.mQueue = queueOrOptions?.queue || [];
			this.mLoop = queueOrOptions?.loop ?? false;
		}

		this.mCursor = 0;
	}

	/**
	 *	Get the first item in the queue.
	 *
	 * @returns The first item in the queue
	 */
	public First(): T {
		return this.mQueue[this.mCursor] as T;
	}

	/**
	 * Peek at the next item in the queue and return it.
	 *
	 * If no item is found, undefined is returned.
	 *
	 * @returns The next item in the queue
	 */
	public Peek(): T | undefined {
		if (!this.mLoop && this.mCursor + 1 >= this.mQueue.length)
			return undefined;
		else if (this.mLoop)
			return this.mQueue[(this.mCursor + 1) % this.mQueue.length];
		else return this.mQueue[this.mCursor + 1];
	}

	/**
	 * Move to the next item in the queue and return it.
	 *
	 * Note: If not found, an error is thrown.
	 *
	 * @returns The next item in the queue
	 */
	public Next(): T {
		if (!this.mLoop && this.mCursor + 1 >= this.mQueue.length) {
			throw new Error("Queue is empty");
		}

		if (this.mLoop) {
			this.mCursor = (this.mCursor + 1) % this.mQueue.length;
		} else {
			this.mCursor++;
		}

		return this.mQueue[this.mCursor] as T;
	}

	/**
	 * Append an item to the end of the queue.
	 */
	public Append(item: T): void {
		this.mQueue.push(item);
	}

	/**
	 * Clear the queue.
	 */
	public Clear(): void {
		this.mQueue = [];
		this.mCursor = 0;
	}
}

export default Queue;
