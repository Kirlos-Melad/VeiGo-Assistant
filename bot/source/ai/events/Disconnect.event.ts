import AIEvent from "@root/source/base/AIEvents";
import Logger from "@root/source/utilities/Logger";

class DisconnectEvent extends AIEvent<"DISCONNECT"> {
	public constructor() {
		super("DISCONNECT");
	}

	public listener() {
		return async (reason: string) => Logger.error(reason);
	}
}

export default DisconnectEvent;
