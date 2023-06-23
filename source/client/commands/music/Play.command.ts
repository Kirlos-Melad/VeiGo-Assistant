import {
	CommandInteraction,
	EmbedBuilder,
	GuildMember,
	GuildTextBasedChannel,
} from "discord.js";
import Command from "../../../classes/Command.js";
import VeigoAssistant from "../../VeigoAssistant.js";

class Play extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("play")
			.setDescription("Plays music from youtube.")
			.addStringOption((option) => {
				option.setName("query");
				option.setDescription("The query to search for.");
				option.setRequired(true);
				return option;
			});
	}

	async execute(interaction: CommandInteraction) {
		interaction.deferReply({
			ephemeral: true,
			fetchReply: true,
		});

		const member = await interaction.guild?.members.fetch({
			user: interaction.user.id,
		});

		if (!member?.voice.channelId) {
			interaction.reply({
				content: "You must be in a voice channel to use this command!",
				ephemeral: true,
			});
			return;
		}

		VeigoAssistant.musicPlayer.play(
			member.voice.channel!,
			interaction.options.get("query")!.value as string,
			{
				textChannel: interaction.channel as GuildTextBasedChannel,
				member: interaction.member as GuildMember,
				message: interaction.channel?.lastMessage!,
				metadata: {
					editReply: interaction.editReply.bind(interaction),
				},
			},
		);
	}
}

export default new Play();
