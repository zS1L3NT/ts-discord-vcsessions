import BotCache from "../models/BotCache"
import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { Collection, VoiceChannel } from "discord.js"
import { iEventFile } from "discordjs-nova"

const file: iEventFile<Entry, GuildCache, BotCache, "voiceStateUpdate"> = {
	name: "voiceStateUpdate",
	execute: async (botCache, oldState, newState) => {
		if (newState.channel && newState.channel) {
			// User joined a voice channel
			const cache = await botCache.getGuildCache(newState.guild)
			const channel = newState.channel
			const user = newState.member!

			if (channel.id === cache.getSessionCreatorChannelId()) {
				const VCs = cache.guild.channels.cache.filter(
					channel =>
						channel instanceof VoiceChannel &&
						channel.name.startsWith(GuildCache.prefix)
				) as Collection<string, VoiceChannel>

				let i = 0
				while (true) {
					const VCName = `${GuildCache.prefix} ` + ++i

					const VC = VCs.find(s => s.name === VCName)
					if (VC) {
						if (VC.members.size > 0) continue
						await user.voice.setChannel(VC)
						cache.clearDeleteTimeout(VC)
						return
					}

					const newVC = await cache.guild.channels.create(VCName, {
						type: "GUILD_VOICE"
					})
					await newVC.setParent(channel.parent)
					await user.voice.setChannel(newVC)
					cache.clearDeleteTimeout(newVC)
					return
				}
			}

			if (channel.name.startsWith(GuildCache.prefix)) {
				cache.clearDeleteTimeout(channel)
			}
		}

		if (oldState && oldState.channel) {
			// User left a voice channel
			const cache = await botCache.getGuildCache(oldState.guild)
			const channel = oldState.channel

			if (
				channel.name.startsWith(GuildCache.prefix) &&
				channel.members.size === 0
			) {
				cache.setDeleteTimeout(channel)
			}
		}
	}
}

export default file
