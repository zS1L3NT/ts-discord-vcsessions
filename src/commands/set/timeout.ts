
module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName("timeout")
		.setDescription("Time the bot will wait before destroying a voice session")
		.addIntegerOption(option =>
			option
				.setName("seconds")
				.setDescription("Number of seconds")
				.setRequired(true)
		),
	execute: async helper => {
		const seconds = helper.integer("seconds")!

		await helper.cache.setTimeout(seconds)
		helper.respond(new EmbedResponse(
			Emoji.GOOD,
			"Timeout updated"
		))
	}
} as iInteractionSubcommandFile