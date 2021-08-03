import { Client } from "discord.js"

const config = require("../config.json")

const bot = new Client()
const VC_Timeout = 5 * 1000
const BOT_PREFIX = "--"
const VC_IDENTIFIER = "➤"
const timeouts: {
	[guildId: string]: {
		[channelId: string]: NodeJS.Timeout
	}
} = {}

bot.login(config.discord).then()
bot.on("ready", () => {
	console.log("Logged in as VC Sessions#1043")
})

bot.on("message", async message => {
	if (!message.guild) return
	const renameRegex = new RegExp(`^${BOT_PREFIX}rename (.+) ${BOT_PREFIX}to (.+)$`)
	const renameCommand = message.content.match(renameRegex)
	if (renameCommand) {
		console.log("Rename command:", message.content)
		const [, oldName, newName] = renameCommand as string[]
		const oldVC = message.guild.channels.cache
			.array()
			.filter(c => c.type === "voice" && c.name === `${VC_IDENTIFIER} ${oldName}`)[0]
		const newVC = message.guild.channels.cache
			.array()
			.filter(c => c.type === "voice" && c.name === `${VC_IDENTIFIER} ${newName}`)[0]
		
		if (!oldVC) {
			console.log("No session:", oldName)
			await message.channel.send(`No session with \`${oldName}\` as it's name`)
			return
		}

		if (newVC) {
			console.log("Session found:", newName)
			await message.channel.send(`Session with \`${newName}\` as it's name already exists`)
			return
		}

		console.time("Rename '" + oldName + "' to '" + newName + "'")
		await oldVC.setName(`${VC_IDENTIFIER} ${newName}`)
		console.timeEnd("Rename '" + oldName + "' to '" + newName + "'")
		await message.channel.send(`Renamed \`${oldName}\` to \`${newName}\``)
		return
	}

	const renameHelpRegex = new RegExp(`^${BOT_PREFIX}rename .*$`)
	const renameHelpCommand = message.content.match(renameHelpRegex)
	if (renameHelpCommand) {
		console.log("Rename help command:", message.content)
		const lines: string[] = []
		lines.push("Rename command help:")
		lines.push(`${BOT_PREFIX}rename <old vc name> ${BOT_PREFIX}to <new vc name>`)
		lines.push(`Example:`)
		lines.push(`${BOT_PREFIX}rename Old voice chat name ${BOT_PREFIX}to New voice chat name`)
		await message.channel.send(lines.join("\n"))
	}
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
	if (newState.channel && newState.channel) {
		// User joined a voice channel

		const channel = newState.channel
		const user = newState.member!

		if (channel.name === "New Session") {
			const VCs = newState.guild.channels.cache
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
					clearTimeoutFor(newState.guild.id, channel.id)
					break
				}

				VC = await newState.guild.channels.create(VCName, {
					type: "voice"
				})
				await VC.setParent(channel.parent)
				await user.voice.setChannel(VC)
				clearTimeoutFor(newState.guild.id, channel.id)
				break
			}

			return
		}

		if (channel.name.startsWith(`${VC_IDENTIFIER} `)) {
			clearTimeoutFor(newState.guild.id, channel.id)
		}
	} 
	
	if (oldState && oldState.channel) {
		// User left a voice channel

		const channel = oldState.channel
		if (channel.name.startsWith(`${VC_IDENTIFIER} `)) {
			if (channel.members.size === 0) {
				setTimeoutFor(
					oldState.guild.id,
					channel.id,
					setTimeout(() => channel.delete(), VC_Timeout)
				)
			}
		}
	}
})

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