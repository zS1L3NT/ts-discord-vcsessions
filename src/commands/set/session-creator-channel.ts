import { iInteractionSubcommandFile } from "../../utilities/BotSetupHelper"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { GuildMember, VoiceChannel } from "discord.js"
import EmbedResponse, { Emoji } from "../../utilities/EmbedResponse"

const config = require("../../../config.json")

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("session-creator-channel")
		.setDescription("Set the voice channel which creates the voice sessions")
		.addChannelOption(option =>
			option
				.setName("channel")
				.setDescription("Leave empty to unset the session creator channel")
		),
	execute: async helper => {
		const member = helper.interaction.member as GuildMember
		if (!member.permissions.has("ADMINISTRATOR") && member.id !== config.discord.dev_id) {
			return helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Only administrators can set bot channels"
			))
		}

		const channel = helper.channel("channel")
		if (channel instanceof VoiceChannel) {
			if (channel.id === helper.cache.getSessionCreatorChannelId()) {
				helper.respond(new EmbedResponse(
					Emoji.BAD,
					"This channel is already the session creator channel"
				))
			}
			else if (helper.cache.getChannels().includes(channel.id)) {
				helper.respond(new EmbedResponse(
					Emoji.BAD,
					"Session creator channel cannot be a voice session"
				))
			}
			else {
				await helper.cache.setSessionCreatorChannelId(channel.id)
				helper.respond(new EmbedResponse(
					Emoji.GOOD,
					`Session creator channel reassigned to ${channel.toString()}`
				))
			}
		}
		else if (channel === null) {
			await helper.cache.setSessionCreatorChannelId("")
			helper.respond(new EmbedResponse(
				Emoji.GOOD,
				`Session creator channel unassigned`
			))
		}
		else {
			helper.respond(new EmbedResponse(
				Emoji.BAD,
				"Please select a voice channel"
			))
		}
	}
} as iInteractionSubcommandFile