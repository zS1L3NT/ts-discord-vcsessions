import BotCache from "../models/BotCache"
import Document, { iValue } from "../models/Document"
import GuildCache from "../models/GuildCache"
import { iEventFile } from "discordjs-nova"
import { useTryAsync } from "no-try"

const file: iEventFile<
	iValue,
	Document,
	GuildCache,
	BotCache,
	"voiceStateUpdate"
> = {
	name: "voiceStateUpdate",
	execute: async (botCache, oldState, newState) => {
		if (newState.channel && newState.channel) {
			// User joined a voice channel
			const cache = await botCache.getGuildCache(newState.guild)
			const channel = newState.channel
			const user = newState.member!

			if (channel.id === cache.getSessionCreatorChannelId()) {
				for (let i = 1; ; i++) {
					const name = `${GuildCache.prefix} ${i}`
					const session = cache.sessions.find(s => s.name === name)

					if (session) {
						if (session.members.size > 0) continue
						const [err] = await useTryAsync(() =>
							user.voice.setChannel(session)
						)

						if (err && err.message === "Missing Permissions") {
							console.error("❌ Lacked sufficient permissions")
							await channel.guild.leave()
							return
						}

						cache.clearDeleteTimeout(session)
						return
					}

					const [err, newVoiceChannel] = await useTryAsync(
						async () => {
							const newVoiceChannel =
								await cache.guild.channels.create(name, {
									type: "GUILD_VOICE"
								})
							await newVoiceChannel.setParent(channel.parent)
							await user.voice.setChannel(newVoiceChannel)
							return newVoiceChannel
						}
					)

					if (err && err.message === "Missing Permissions") {
						console.error("❌ Lacked sufficient permissions")
						await channel.guild.leave()
						return
					}

					cache.sessions.push(newVoiceChannel)
					cache.clearDeleteTimeout(newVoiceChannel)
					return
				}
			}

			if (cache.sessions.find(s => s.id === channel.id)) {
				cache.clearDeleteTimeout(channel)
			}
		}

		if (oldState && oldState.channel) {
			// User left a voice channel
			const cache = await botCache.getGuildCache(oldState.guild)
			const channel = oldState.channel

			if (
				cache.sessions.find(s => s.id === channel.id) &&
				channel.members.size === 0
			) {
				cache.setDeleteTimeout(channel)
			}
		}
	}
}

export default file
