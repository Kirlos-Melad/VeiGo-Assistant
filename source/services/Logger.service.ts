import { createLogger, format, transports, Logger } from "winston";
import wrapAnsi from "wrap-ansi";

import DateFormatter from "../utilities/DateFormatter.ts";

const { combine, colorize, printf } = format;

class LoggerService {
	private readonly mLogger: Logger;

	public constructor() {
		this.mLogger = createLogger({
			level: "INFORMATION",
			levels: {
				ERROR: 0,
				WARNING: 1,
				INFORMATION: 2,
			},
			format: this.format(),
			transports: [new transports.Console()],
		});
	}

	private format() {
		return combine(
			printf(({ level, message }) => {
				const indentation = " ".repeat(10);

				let retMessage = `[${DateFormatter.FormatLong(Date.now())}] `;
				retMessage += `[${level}] `;
				retMessage += "\n";

				const formattedMessage =
					message instanceof Object
						? JSON.stringify(message)
						: message;
				const wrappedMessage = wrapAnsi(formattedMessage, 140, {
					trim: false,
					hard: true,
					wordWrap: true,
				});

				const indentedMessage = wrappedMessage
					.split("\n")
					.map(
						(line: string, index: number) =>
							`${indentation}${line}`,
					)
					.join("\n");

				return (
					colorize({
						level: false,
						message: true,
						colors: {
							ERROR: "bold red",
							WARNING: "yellow",
							INFORMATION: "green",
						},
					}).colorize(level, retMessage) + indentedMessage
				);
			}),
		);
	}

	public information(message: unknown) {
		this.mLogger.log("INFORMATION", message);
	}

	public warning(message: unknown) {
		this.mLogger.log("WARNING", message);
	}

	public error(message: unknown) {
		this.mLogger.log("ERROR", message);
	}
}

export default new LoggerService();
