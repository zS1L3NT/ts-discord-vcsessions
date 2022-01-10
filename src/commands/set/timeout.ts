import Entry from "../../models/Entry"
import GuildCache from "../../models/GuildCache"
import { Emoji, iInteractionSubcommandFile, ResponseBuilder } from "nova-bot"

const file: iInteractionSubcommandFile<Entry, GuildCache> = {
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
