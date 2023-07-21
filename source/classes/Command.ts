import {
	Awaitable,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";

abstract class Command<
	T extends SlashCommandBuilder | SlashCommandSubcommandBuilder,
> {
	protected mCommandBuilder: T;

	constructor(builder: T) {
		this.mCommandBuilder = builder;
	}

	public get builder() {
		return this.mCommandBuilder;
	}

	public abstract execute(
		interaction: ChatInputCommandInteraction,
	): Awaitable<void>;

	public get metadata() {
		return this.mCommandBuilder.toJSON();
	}
}

export default Command;
