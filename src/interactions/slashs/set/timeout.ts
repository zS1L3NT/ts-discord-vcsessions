import Entry from "../../../data/Entry"
import GuildCache from "../../../data/GuildCache"
import { Emoji, iSlashSubFile, ResponseBuilder } from "nova-bot"

const file: iSlashSubFile<Entry, GuildCache> = {
	defer: true,
	ephemeral: true,
	data: {
		name: "timeout",
		description: {
			slash: "Change the bot VC delete timeout",
			help: "Change the time the bot will wait before destroying a voice session"
		},
		options: [
			{
				name: "seconds",
				description: {
					slash: "Number of seconds",
					help: "The number of seconds"
				},
				type: "number",
				requirements: "Number",
				required: true
			}
		]
	},
	execute: async helper => {
		const seconds = helper.integer("seconds")!

		await helper.cache.setTimeout(seconds)
		helper.respond(new ResponseBuilder(Emoji.GOOD, "Timeout updated"))
	}
}

export default file
