import BotCache from "./models/BotCache"
import Document from "./models/Document"
import GuildCache from "./models/GuildCache"
import NovaBot from "discordjs-nova"
import { Intents } from "discord.js"

const config = require("../config.json")

new NovaBot({
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS
	],
	name: "VC Sessions#1043",
	cwd: __dirname,
	config,
	updatesMinutely: false,

	help: {
		message: cache =>
			[
				"Welcome to VC Sessions!",
				"VC Sessions is a bot that automatically creates and clears voice sessions for you",
				"Message commands are currently not supported for VC Sessions",
				"",
				"**Make sure to set the session creator channel with the **`set session-creator-channel`** command**",
				"VC Sessions will move users to a new voice session with the server `prefix`",
				"VC Sessions will also clear the voice session after a defined duration, `timeout`"
			].join("\n"),
		icon: "https://cdn.discordapp.com/avatars/833864979232456755/f8983bc2f324c98a393899a739ebe67c.webp?size=160"
	},

	Document,
	GuildCache,
	BotCache
})
