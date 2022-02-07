import BotCache from "./data/BotCache"
import colors from "colors"
import config from "./config.json"
import GuildCache from "./data/GuildCache"
import NovaBot from "nova-bot"
import path from "path"
import Tracer from "tracer"
import { Intents } from "discord.js"

global.logger = Tracer.colorConsole({
	level: process.env.LOG_LEVEL || "log",
	format: [
		"[{{timestamp}}] <{{path}}> {{message}}",
		{
			//@ts-ignore
			alert: "[{{timestamp}}] <{{path}}, Line {{line}}> {{message}}",
			warn: "[{{timestamp}}] <{{path}}, Line {{line}}> {{message}}",
			error: "[{{timestamp}}] <{{path}}, Line {{line}} at {{pos}}> {{message}}"
		}
	],
	methods: ["log", "discord", "debug", "info", "alert", "warn", "error"],
	dateformat: "dd mmm yyyy, hh:MM:sstt",
	filters: {
		log: colors.grey,
		//@ts-ignore
		discord: colors.cyan,
		debug: colors.blue,
		info: colors.green,
		//@ts-ignore
		alert: colors.yellow,
		warn: colors.yellow.bold.italic,
		error: colors.red.bold.italic
	},
	preprocess: data => {
		data.path = data.path
			.split("nova-bot")
			.at(-1)!
			.replace(/^(\/|\\)dist/, "nova-bot")
			.replaceAll("\\", "/")
		data.path = data.path
			.split("ts-discord-soundroid")
			.at(-1)!
			.replace(/^(\/|\\)(dist|src)/, "src")
			.replaceAll("\\", "/")
	}
})

new NovaBot({
	name: "VC Sessions#1043",
	intents: [
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS
	],
	directory: path.join(__dirname, "interactions"),
	config,
	updatesMinutely: false,
	//@ts-ignore
	logger: global.logger,

	help: {
		message: cache =>
			[
				"Welcome to VC Sessions!",
				"VC Sessions is a bot that automatically creates and clears voice sessions for you",
				"Message commands are currently not supported for VC Sessions",
				"",
				"**Make sure to set the session creator channel with the **`set session-creator-channel`** command**",
				"VC Sessions will also clear the voice session after a defined duration, `timeout`"
			].join("\n"),
		icon: "https://cdn.discordapp.com/avatars/833864979232456755/f8983bc2f324c98a393899a739ebe67c.webp?size=160"
	},

	GuildCache,
	BotCache,

	onSetup: botCache => {
		botCache.bot.user!.setPresence({
			activities: [
				{
					name: "/help",
					type: "LISTENING"
				}
			]
		})
	}
})
