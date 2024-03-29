import { SlashCommandBuilder } from "discord.js";
import path from "path";

import Command from "../../base/Command.ts";
import GroupCommand from "../../base/GroupCommand.ts";
import AbsolutePath from "../../utilities/AbsolutePath.ts";
import DependencyLoader from "../../utilities/DependencyLoader.ts";
import Logger from "../../utilities/Logger.ts";

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
const AudioGroupCommand = new GroupCommand(
	new SlashCommandBuilder().setName("audio").setDescription("Audio commands"),
);
const AiGroupCommand = new GroupCommand(
	new SlashCommandBuilder().setName("ai").setDescription("AI commands"),
);


await Promise.all([
	LoadCommands(SetupGroupCommand, "setup"),
	LoadCommands(AudioGroupCommand, "audio"),
	LoadCommands(AiGroupCommand, "ai"),
]);

export { AiGroupCommand, AudioGroupCommand, SetupGroupCommand };
