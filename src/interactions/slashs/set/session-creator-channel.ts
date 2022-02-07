import config from "../../../config.json"
import Entry from "../../../data/Entry"
import GuildCache from "../../../data/GuildCache"
import { Emoji, iSlashSubFile, ResponseBuilder } from "nova-bot"
import { GuildMember, VoiceChannel } from "discord.js"

const file: iSlashSubFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "session-creator-channel",
		description: {
			slash: "Set the voice channel which creates the voice sessions",
			help: "Sets the voice channel that the bot watches to create new sessions for users"
		},
		options: [
			{
				name: "channel",
				description: {
					slash: "Leave empty to unset the session creator channel",
					help: "Leave empty to unset the session creator channel"
				},
				type: "channel",
				requirements:
					"Channel that isn't already the session creator channel nor a voice session",
				required: false
			}
		]
	},
	execute: async helper => {
		const member = helper.interaction.member as GuildMember
		if (
			!member.permissions.has("ADMINISTRATOR") &&
			member.id !== config.discord.dev_id
		) {
			return helper.respond(
				new ResponseBuilder(
					Emoji.BAD,
					"Only administrators can set bot channels"
				)
			)
		}

		const channel = helper.channel("channel")
		if (channel instanceof VoiceChannel) {
			if (channel.id === helper.cache.getSessionCreatorChannelId()) {
				helper.respond(
					new ResponseBuilder(
						Emoji.BAD,
						"This channel is already the session creator channel"
					)
				)
			} else if (helper.cache.getChannels().includes(channel.id)) {
				helper.respond(
					new ResponseBuilder(
						Emoji.BAD,
						"Session creator channel cannot be a voice session"
					)
				)
			} else {
				await helper.cache.setSessionCreatorChannelId(channel.id)
				helper.respond(
					new ResponseBuilder(
						Emoji.GOOD,
						`Session creator channel reassigned to \`#${channel.name}\``
					)
				)
			}
		} else if (channel === null) {
			await helper.cache.setSessionCreatorChannelId("")
			helper.respond(
				new ResponseBuilder(
					Emoji.GOOD,
					`Session creator channel unassigned`
				)
			)
		} else {
			helper.respond(
				new ResponseBuilder(Emoji.BAD, "Please select a voice channel")
			)
		}
	}
}

export default file
