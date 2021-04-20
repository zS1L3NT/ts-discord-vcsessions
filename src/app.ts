import { Client } from "discord.js"

const bot = new Client()

bot.login(require("../token.json"))

bot.on("ready", () => {
	console.log("Logged in as Voice Bot#1043")
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
	const guild = newState.guild || oldState.guild

	if (!oldState.channel) {
		// User joined a voice channel

		const channel = newState.channel!
		const user = newState.member!

		if (channel.name === "New Session") {
			const sessions = guild.channels.cache
				.array()
				.filter(
					c => c.type === "voice" && c.name.startsWith("Session ")
				)
				.map(c => c.name)

			const category = guild.channels.cache
				.array()
				.filter(
					c => c.type === "category" && c.name === "Voice Channels"
				)[0]

			let i = 0
			while (true) {
				const session = "Session " + ++i
				if (sessions.includes(session)) continue

				const vc = await guild.channels.create(session, {
					type: "voice"
				})
				vc.setParent(category.id)
				await user.voice.setChannel(vc)
				break
			}
		}

		return
	}

	if (!newState.channel) {
		// User left a voice channel

		const channel = oldState.channel!

		if (channel.name.startsWith("Session ")) {
			if (channel.members.size === 0) {
				channel.delete()
			}
		}

		return
	}

	// User changed voice channel
})
