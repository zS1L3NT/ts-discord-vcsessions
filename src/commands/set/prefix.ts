import Document, { iValue } from "../../models/Document"
import GuildCache from "../../models/GuildCache"
import {
	Emoji,
	iInteractionSubcommandFile,
	ResponseBuilder
} from "discordjs-nova"
import { VoiceChannel } from "discord.js"
import { SlashCommandSubcommandBuilder } from "@discordjs/builders"

const file: iInteractionSubcommandFile<iValue, Document, GuildCache> = {
	defer: true,
	ephemeral: true,
	help: {
		description: "Sets the prefix for a new voice channel",
		params: [
			{
				name: "prefix",
				description: "The prefix for a new voice channel",
				requirements: "Text",
				required: true
			}
		]
	},
	builder: new SlashCommandSubcommandBuilder()
		.setName("prefix")
		.setDescription("Prefix for new voice sessions")
		.addStringOption(option =>
			option
				.setName("prefix")
				.setDescription("Prefix for new voice sessions")
				.setRequired(true)
		),
	execute: async helper => {
		const prefix = helper.string("prefix")!
		const oldPrefix = helper.cache.getPrefix()

		await helper.cache.setPrefix(prefix)

		for (const [, channel] of helper.cache.guild.channels.cache) {
			if (!(channel instanceof VoiceChannel)) continue
			if (channel.name.startsWith(oldPrefix)) {
				await channel.setName(channel.name.replace(oldPrefix, prefix))
			}
		}

		helper.respond(new ResponseBuilder(Emoji.GOOD, "Prefix updated"))
	}
}

export default file
