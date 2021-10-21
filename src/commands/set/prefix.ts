import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { VoiceChannel } from "discord.js"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("prefix")
		.setDescription("Prefix for new voice sessions")
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("Prefix for new voice sessions")
				.setRequired(true)
		),
	execute: async helper => {
		const prefix = helper.string("prefix")!
		const oldPrefix = helper.cache.getPrefix()

		await helper.cache.setPrefix(prefix)

		for (const [, channel] of helper.cache.guild.channels.cache) {
			if (!(channel instanceof VoiceChannel)) continue
			if (channel.name.startsWith(oldPrefix)) {
				await channel.setName(channel.name.replace(oldPrefix, prefix))
			}
		}

		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"Prefix updated"
		))
	}
} as iInteractionSubcommandFile