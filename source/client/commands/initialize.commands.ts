import path from "path";
import { SlashCommandBuilder } from "discord.js";

import DependencyLoader from "../../utilities/DependencyLoader.ts";
import AbsolutePath from "../../utilities/AbsolutePath.ts";
import GroupCommand from "../../base/GroupCommand.ts";
import Logger from "../../utilities/Logger.ts";
import Command from "../../base/Command.ts";

async function LoadCommands(groupCommand: GroupCommand, directory: string) {
	const loadedEvents = await DependencyLoader(
		path.join(AbsolutePath(import.meta.url), directory),
		true,
	);

	for (const { default: subCommand } of loadedEvents) {
		if (subCommand instanceof Command) {
			Logger.information(
				`Loaded sub-command ${subCommand.metadata.name} of group command ${groupCommand.metadata.name}`,
			);
			groupCommand.AddSubCommand(subCommand);
		} else {
			Logger.warning(`Sub-command is missing`);
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
