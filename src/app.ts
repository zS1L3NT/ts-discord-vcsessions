import { CategoryChannel, Client, Guild } from "discord.js"

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
			const VCs = guild.channels.cache
				.array()
				.filter(
					c => c.type === "voice" && c.name.startsWith("Session ")
				)

			let i = 0
			while (true) {
				const VCName = "Session " + ++i

				let VC
				if (VC = VCs.find(s => s.name === VCName)) {
					if (VC.members.size > 0) continue
					await user.voice.setChannel(VC)
					break
				}

				VC = await guild.channels.create(VCName, {
					type: "voice"
				})
				VC.setParent(await getCategoryId(guild))
				await user.voice.setChannel(VC)
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
