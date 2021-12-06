import Document, { iValue } from "../../models/Document"
import GuildCache from "../../models/GuildCache"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "discordjs-nova"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"

const file: iInteractionSubcommandFile<iValue, Document, GuildCache> = {
	defer: true,
	ephemeral: true,
	help: {
		description:
			"Set the time VC Sessions will wait before clearing an empty voice session",
		params: [
			{
				name: "timeout",
				description: "Number of seconds the bot will wait",
				requirements: "Number",
				required: true
			}
		]
	},
	builder: new SlashCommandSubcommandBuilder()
		.setName("timeout")
		.setDescription(
			"Time the bot will wait before destroying a voice session"
		)
		.addIntegerOption(option =>
			option
				.setName("seconds")
				.setDescription("Number of seconds")
				.setRequired(true)
		),
	execute: async helper => {
		const seconds = helper.integer("seconds")!

		await helper.cache.setTimeout(seconds)
		helper.respond(new ResponseBuilder(Emoji.GOOD, "Timeout updated"))
	}
}

export default file
