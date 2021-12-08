import Entry from "./Entry"
import GuildCache from "./GuildCache"
import { BaseBotCache } from "discordjs-nova"

export default class BotCache extends BaseBotCache<Entry, GuildCache> {
	public onConstruct(): void {}
	public onSetGuildCache(cache: GuildCache): void {}

	public async registerGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (!doc.exists) {
			await this.ref.doc(guildId).set(this.getEmptyEntry())
		}
	}

	public async eraseGuildCache(guildId: string) {
		const doc = await this.ref.doc(guildId).get()
		if (doc.exists) {
			await this.ref.doc(guildId).delete()
		}
	}

	public getEmptyEntry(): Entry {
		return {
			session_creator_channel_id: "",
			timeout: 5
		}
	}
}
