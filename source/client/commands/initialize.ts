import path from "path";

import DependencyLoader from "../../utilities/DependencyLoader.js";
import __dirname from "../../utilities/__dirname.js";
import GroupCommand from "../../core/GroupCommand.js";
import LoggerService from "../../services/Logger.service.js";
import { SlashCommandBuilder } from "discord.js";
import Command from "../../classes/Command.js";

async function LoadCommands(groupCommand: GroupCommand, directory: string) {
	const loadedEvents = await DependencyLoader(
		path.join(__dirname(import.meta.url), directory),
		true,
	);

	for (const { default: subCommand } of loadedEvents) {
		if (subCommand instanceof Command) {
			LoggerService.information(
				`Loaded sub-command ${subCommand.metadata.name} of group command ${groupCommand.metadata.name}`,
			);
			groupCommand.AddSubCommand(subCommand);
		} else {
			LoggerService.warning(`Sub-command is missing`);
		}
	}
}

const SetupGroupCommand = new GroupCommand(
	new SlashCommandBuilder().setName("setup").setDescription("Setup commands"),
);
const DebugGroupCommand = new GroupCommand(
	new SlashCommandBuilder().setName("debug").setDescription("Debug commands"),
);
const AudioGroupCommand = new GroupCommand(
	new SlashCommandBuilder().setName("audio").setDescription("Audio commands"),
);

await Promise.all([
	LoadCommands(SetupGroupCommand, "setup"),
	LoadCommands(DebugGroupCommand, "debug"),
	LoadCommands(AudioGroupCommand, "audio"),
]);

export { SetupGroupCommand, DebugGroupCommand, AudioGroupCommand };
