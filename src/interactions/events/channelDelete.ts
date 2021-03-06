import BotCache from "../../data/BotCache"
import Entry from "../../data/Entry"
import GuildCache from "../../data/GuildCache"
import { iEventFile } from "nova-bot"
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

export default file
