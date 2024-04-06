import AIEvent from "@root/source/base/AIEvents";
import Logger from "@root/source/utilities/Logger";

class ConnectErrorEvent extends AIEvent<"CONNECT_ERROR"> {
	public constructor() {
		super("CONNECT_ERROR");
	}

	public listener() {
		return async (error: Error) => Logger.error(error);
	}
}

export default ConnectErrorEvent;
