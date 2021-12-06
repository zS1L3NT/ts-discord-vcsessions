import BotCache from "../models/BotCache"
import Document, { iValue } from "../models/Document"
import GuildCache from "../models/GuildCache"
import { iEventFile } from "discordjs-nova"
import { VoiceChannel } from "discord.js"

const file: iEventFile<
	iValue,
	Document,
	GuildCache,
	BotCache,
	"channelDelete"
> = {
	name: "channelDelete",
	execute: async (botCache, channel) => {
		if (!(channel instanceof VoiceChannel)) return

		const cache = await botCache.getGuildCache(channel.guild)

		if (
			cache.sessions.find(s => s.id === channel.id) ||
			cache.getChannels().includes(channel.id)
		) {
			cache.deleteChannel(channel)
		}
	}
}

export default file
