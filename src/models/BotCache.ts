import GuildCache from "./GuildCache"
import Document, { iValue } from "./Document"
import { BaseBotCache } from "discordjs-nova"

export default class BotCache extends BaseBotCache<Entry, GuildCache> {

	public onConstruct(): void {
	}

	public onSetGuildCache(cache: GuildCache): void {
	}

	public async registerGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (!doc.exists) {
			await this.ref.doc(guildId).set(new Document().getEmpty().value)
		}
	}

	public async eraseGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (doc.exists) {
			await this.ref.doc(guildId).delete()
		}
		this.guilds.delete(guildId)
	}
}
