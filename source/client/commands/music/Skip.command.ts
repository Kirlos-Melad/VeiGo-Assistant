import { CommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../../../classes/Command.js";
import VeigoAssistant from "../../VeigoAssistant.js";

class Skip extends Command {
	constructor() {
		super();

		this.buildCommand();
	}

	protected buildCommand() {
		this.mCommandBuilder
			.setName("skip")
			.setDescription("Skip the current song.");
	}

	async execute(interaction: CommandInteraction) {
		interaction.reply({
			content: "Skipping song...",
			ephemeral: true,
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

		const song = await VeigoAssistant.musicPlayer.skip(
			interaction.guildId!,
		);

		const embed = new EmbedBuilder();

		embed.setTitle("Skip song");
		embed.setDescription(`Skipped **[${song!.name}](${song!.url})**`);
		embed.setThumbnail(song!.thumbnail || null);

		interaction.channel!.send({ embeds: [embed] });
	}
}

export default new Skip();
