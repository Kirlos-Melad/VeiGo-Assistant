import {
	CommandInteraction,
	SlashCommandBuilder,
	EmbedBuilder,
} from "discord.js";

abstract class Command {
	protected mCommandBuilder: SlashCommandBuilder;
	protected mEmbed?: EmbedBuilder;

	constructor() {
		this.mCommandBuilder = new SlashCommandBuilder();
	}

	public abstract execute(interaction: CommandInteraction): Promise<void>;

	public get metadata() {
		return this.mCommandBuilder.toJSON();
	}
}

export default Command;
