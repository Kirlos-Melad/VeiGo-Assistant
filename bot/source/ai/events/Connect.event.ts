import AIEvent from "@root/source/base/AIEvents";
import Logger from "@root/source/utilities/Logger";

class ConnectEvent extends AIEvent<"CONNECT"> {
	public constructor() {
		super("CONNECT");
	}

	public listener() {
		return async () => Logger.information("Connected to AI server");
	}
}

export default ConnectEvent;
