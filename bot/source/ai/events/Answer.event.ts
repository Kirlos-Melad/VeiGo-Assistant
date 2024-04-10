import AIEvent, { Resolve } from "@root/source/base/AIEvents";

class AnswerEvent extends AIEvent<"ANSWER"> {
	public constructor() {
		super("ANSWER");
	}

	public listener(resolve: Resolve<string>) {
		return async (response: string) => resolve(response);
	}
}

export default AnswerEvent;
