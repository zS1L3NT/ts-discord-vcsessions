import { CategoryChannel, Client, ClientVoiceManager, Guild } from "discord.js"

const bot = new Client()
const VC_Timeout = 60 * 60 * 2
const BOT_PREFIX = "."
const VC_IDENTIFIER = "➤"
const timeouts: {
	[guildId: string]: {
		[channelId: string]: NodeJS.Timeout
	}
} = {}

bot.login(require("../token.json"))
bot.on("ready", () => {
	console.log("Logged in as Voice Bot#1043")
})

bot.on("message", async message => {
	const renameRegex = new RegExp(`^\\${BOT_PREFIX}rename (\\S+) (\\S+)$`)
	const match = message.content.match(renameRegex)
	if (match) {
		const [_, oldName, newName] = match as string[]
		const guild = message.guild!
		const VC = guild.channels.cache
			.array()
			.filter(c => c.type === "voice" && c.name.startsWith(`${VC_IDENTIFIER} ${oldName}`))[0]
		
		if (!VC) {
			await message.channel.send(`No session with \`${oldName}\` as it's name`)
			return
		}

		await VC.setName(`${VC_IDENTIFIER} ${newName}`)
		await message.channel.send(`Renamed \`${oldName}\` to \`${newName}\``)
	}
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
	const guild = newState.guild || oldState.guild

	if (newState.channel) {
		// User joined a voice channel

		const channel = newState.channel!
		const user = newState.member!

		if (channel.name === "New Session") {
			const VCs = guild.channels.cache
				.array()
				.filter(
					c => c.type === "voice" && c.name.startsWith(`${VC_IDENTIFIER} `)
				)

			let i = 0
			while (true) {
				const VCName = `${VC_IDENTIFIER} ` + ++i

				let VC
				if ((VC = VCs.find(s => s.name === VCName))) {
					if (VC.members.size > 0) continue
					await user.voice.setChannel(VC)
					clearTimeoutFor(guild.id, channel.id)
					break
				}

				VC = await guild.channels.create(VCName, {
					type: "voice"
				})
				VC.setParent(await getCategoryId(guild))
				await user.voice.setChannel(VC)
				clearTimeoutFor(guild.id, channel.id)
				break
			}
		}

		if (channel.name.startsWith(`${VC_IDENTIFIER} `)) {
			clearTimeoutFor(guild.id, channel.id)
		}
	} else {
		// User left a voice channel

		const channel = oldState.channel!

		if (channel.name.startsWith(`${VC_IDENTIFIER} `)) {
			if (channel.members.size === 0) {
				setTimeoutFor(
					guild.id,
					channel.id,
					setTimeout(() => channel.delete(), VC_Timeout)
				)
			}
		}
	}
})

const getCategoryId = async (guild: Guild) => {
	let category = guild.channels.cache
		.array()
		.filter(
			c => c.type === "category" && c.name === "Voice Sessions"
		)[0] as CategoryChannel

	if (!category) {
		category = await guild.channels.create("Voice Sessions", {
			type: "category"
		})
	}

	return category.id
}

const clearTimeoutFor = (guildId: string, channelId: string) => {
	if (timeouts[guildId]?.[channelId]) {
		clearTimeout(timeouts[guildId][channelId])
		delete timeouts[guildId][channelId]
	}
}

const setTimeoutFor = (
	guildId: string,
	channelId: string,
	timeout: NodeJS.Timeout
) => {
	if (!timeouts[guildId]) {
		timeouts[guildId] = {}
	}

	timeouts[guildId][channelId] = timeout
}