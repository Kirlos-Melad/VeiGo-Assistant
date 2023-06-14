import {
	CommandInteraction,
	GuildMember,
	GuildTextBasedChannel,
} from "discord.js";
import Command from "../../../classes/Command.js";
import Bot from "../../Bot.js";

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
		const member = await interaction.guild?.members.fetch({
			user: interaction.user.id,
		});

		if (!member?.voice.channelId)
			interaction.reply({
				content: "You must be in a voice channel to use this command!",
				ephemeral: true,
			});
		else {
			interaction.deferReply({ ephemeral: true });

			await Bot.instance.musicPlayer.play(
				member.voice.channel!,
				interaction.options.get("query")!.value as string,
				{
					textChannel: interaction.channel as GuildTextBasedChannel,
					member: interaction.member as GuildMember,
					message: interaction.channel?.lastMessage!,
				},
			);

			interaction.editReply({
				content: "Playing music",
			});
		}

		// const embed = new EmbedBuilder();

		// embed.setTitle("Playing music");
		// embed.setDescription(`Playing music`);
		// embed.setColor("#00ff00");
		// embed.addFields([]);

		// await interaction.reply({ embeds: [embed] });
	}
}

export default new Play();
