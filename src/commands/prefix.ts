import { iInteractionFile } from "../utilities/BotSetupHelper"
import { SlashCommandBuilder } from "@discordjs/builders"
import { VoiceChannel } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("prefix")
		.setDescription("Prefix for new voice sessions")
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("Prefix for new voice sessions")
				.setRequired(true)
		),
	execute: async helper => {
		const prefix = helper.string("prefix", true)!
		const oldPrefix = helper.cache.getPrefix()

		await helper.cache.setPrefix(prefix)

		for (const [, channel] of helper.cache.guild.channels.cache) {
			if (!(channel instanceof VoiceChannel)) continue
			if (channel.name.startsWith(oldPrefix)) {
				await channel.setName(channel.name.replace(oldPrefix, prefix))
			}
		}

		helper.respond("✅ Prefix updated")
	}
} as iInteractionFile