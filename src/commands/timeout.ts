import { iInteractionFile } from "../utilities/BotSetupHelper"
import { SlashCommandBuilder } from "@discordjs/builders"
import EmbedResponse, { Emoji } from "../utilities/EmbedResponse"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timeout")
		.setDescription("Time the bot will wait before destroying a voice session")
		.addIntegerOption(option =>
			option
				.setName("seconds")
				.setDescription("Number of seconds")
				.setRequired(true)
		),
	execute: async helper => {
		const seconds = helper.integer("seconds", true)!

		await helper.cache.setTimeout(seconds)
		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"Timeout updated"
		))
	}
} as iInteractionFile