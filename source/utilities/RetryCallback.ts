async function RetryAsyncCallback(
	repeat: number,
	callback: (...args: any[]) => Promise<any>,
	...args: any[]
) {
	try {
		return await callback(...args);
	} catch (error) {
		if (repeat) RetryAsyncCallback(repeat - 1, callback, ...args);
		else throw error;
	}
}

function RetrySyncCallback(
	repeat: number,
	callback: (...args: any[]) => any,
	...args: any[]
) {
	try {
		return callback(...args);
	} catch (error) {
		if (repeat) RetryAsyncCallback(repeat - 1, callback, ...args);
		else throw error;
	}
}

export { RetryAsyncCallback, RetrySyncCallback };
