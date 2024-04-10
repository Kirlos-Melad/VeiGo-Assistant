import AIEvent from "@root/source/base/AIEvents";
import Logger from "@root/source/utilities/Logger";

class ErrorEvent extends AIEvent<"ERROR"> {
	public constructor() {
		super("ERROR");
	}

	public listener() {
		return async (error: Error) => Logger.error(error);
	}
}

export default ErrorEvent;
