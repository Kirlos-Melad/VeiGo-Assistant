import {
	Awaitable,
	CacheType,
	ChatInputCommandInteraction,
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import Command from "../classes/Command.ts";

class GroupCommand extends Command<SlashCommandBuilder> {
	private mSubCommands: Record<
		string,
		(interaction: ChatInputCommandInteraction) => Awaitable<void>
	>;

	constructor(builder: SlashCommandBuilder) {
		super(builder);
		this.mSubCommands = {};
	}

	public execute(interaction: ChatInputCommandInteraction) {
		const subCommand = interaction.options.getSubcommand();

		this.mSubCommands[subCommand]?.(interaction);
	}

	public AddSubCommand(subCommand: Command<SlashCommandSubcommandBuilder>) {
		this.mCommandBuilder.addSubcommand(subCommand.builder);
		this.mSubCommands[subCommand.metadata.name] = subCommand.execute;

		return this;
	}
}

export default GroupCommand;
