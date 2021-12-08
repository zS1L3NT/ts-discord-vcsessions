import BotCache from "../models/BotCache"
import Entry from "../models/Entry"
import GuildCache from "../models/GuildCache"
import { iEventFile } from "discordjs-nova"
import { VoiceChannel } from "discord.js"

const file: iEventFile<Entry, GuildCache, BotCache, "channelDelete"> = {
	name: "channelDelete",
	execute: async (botCache, channel) => {
		if (!(channel instanceof VoiceChannel)) return

		const cache = await botCache.getGuildCache(channel.guild)

		if (cache.getChannels().includes(channel.id)) {
			cache.deleteChannel(channel)
		}
	}
}
