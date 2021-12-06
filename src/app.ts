import { Client, Collection, Intents, VoiceChannel } from "discord.js"
import BotSetupHelper from "./utilities/BotSetupHelper"
import GuildCache from "./models/GuildCache"

const config = require("../config.json")

// region Initialize bot
const bot = new Client({
	intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
})
const botSetupHelper = new BotSetupHelper(bot)
const { cache: botCache } = botSetupHelper
// endregion

void bot.login(config.discord.token)
bot.on("ready", async () => {
	console.log("Logged in as VC Sessions Bot#1043")

	let i = 0
	let count = bot.guilds.cache.size
	for (const guild of bot.guilds.cache.toJSON()) {
		const tag = `${(++i).toString().padStart(count.toString().length, "0")}/${count}`
		let cache: GuildCache | undefined
		try {
			cache = await botCache.getGuildCache(guild)
		} catch (err) {
			console.error(`${tag} ❌ Couldn't find a Firebase Document for Guild(${guild.name})`)
			guild.leave()
			continue
		}

		try {
			await botSetupHelper.deploySlashCommands(guild)
		} catch (err) {
			console.error(`${tag} ❌ Couldn't get Slash Command permission for Guild(${guild.name})`)
			guild.leave()
			continue
		}

		console.log(`${tag} ✅ Restored cache for Guild(${guild.name})`)
	}
	console.log(`✅ All bot cache restored`)
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
	if (newState.channel && newState.channel) {
		// User joined a voice channel
		const cache = await botCache.getGuildCache(newState.guild)
		const channel = newState.channel
		const user = newState.member!

		if (channel.id === cache.getSessionCreatorChannelId()) {
			const VCs = cache.guild.channels.cache.filter(channel =>
				channel instanceof VoiceChannel &&
				channel.name.startsWith(cache.getPrefix())
			) as Collection<string, VoiceChannel>

			let i = 0
			while (true) {
				const VCName = `${cache.getPrefix()} ` + ++i

				const VC = VCs.find(s => s.name === VCName)
				if (VC) {
					if (VC.members.size > 0) continue
					await user.voice.setChannel(VC)
					cache.clearDeleteTimeout(VC)
					return
				}

				const newVC = await cache.guild.channels.create(
					VCName,
					{ type: "GUILD_VOICE" }
				)
				await newVC.setParent(channel.parent)
				await user.voice.setChannel(newVC)
				cache.clearDeleteTimeout(newVC)
				return
			}
		}

		if (channel.name.startsWith(cache.getPrefix())) {
			cache.clearDeleteTimeout(channel)
		}
	}

	if (oldState && oldState.channel) {
		// User left a voice channel
		const cache = await botCache.getGuildCache(oldState.guild)
		const channel = oldState.channel

		if (channel.name.startsWith(cache.getPrefix()) && channel.members.size === 0) {
			cache.setDeleteTimeout(channel)
		}
	}
})

bot.on("channelDelete", async channel => {
	if (!(channel instanceof VoiceChannel)) return

	const cache = await botCache.getGuildCache(channel.guild)

	if (cache.getChannels().includes(channel.id)) {
		cache.deleteChannel(channel)
	}
})