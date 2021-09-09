import { iInteractionFile } from "../utilities/BotSetupHelper"
import { SlashCommandBuilder } from "@discordjs/builders"
import { VoiceChannel } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("rename")
		.setDescription("Rename a voice session")
		.addChannelOption(option =>
			option
				.setName("voice-session")
				.setDescription("Voice session to be renamed")
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName("name")
				.setDescription("New name of the voice session")
				.setRequired(true)
		),
	execute: async helper => {
		const voice_session = helper.channel("voice-session", true)!
		const name = helper.string("name", true)!

		if (voice_session instanceof VoiceChannel) {
			await voice_session.setName(`${helper.cache.getPrefix()} ${name}`)
			helper.respond("✅ Voice session updated")
		}
		else {
			helper.respond("❌ Please select a voice channel")
		}

	}
} as iInteractionFile