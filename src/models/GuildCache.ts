import Entry from "./Entry"
import { BaseGuildCache } from "nova-bot"
import { Channel, Collection } from "discord.js"

export default class GuildCache extends BaseGuildCache<Entry, GuildCache> {
	public static prefix = "➤" as const
	private timeouts = new Collection<string, NodeJS.Timeout | null>()

	public resolve(resolve: (cache: GuildCache) => void): void {
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.entry = snap.data() as Entry
				resolve(this)
			}
		})
	}

	public onConstruct() {}
	public updateMinutely(debug: number): void {}

	public clearDeleteTimeout(channel: Channel) {
		if (this.timeouts.get(channel.id)) {
			if (this.timeouts.get(channel.id) !== null) {
				clearTimeout(this.timeouts.get(channel.id)!)
				this.timeouts.set(channel.id, null)
			}
		} else {
			this.timeouts.set(channel.id, null)
		}
	}

	public setDeleteTimeout(channel: Channel) {
		this.timeouts.set(
			channel.id,
			setTimeout(() => {
				channel.delete().catch(() => {})
				this.deleteChannel(channel)
			}, this.getTimeout() * 1000)
		)
	}

	public deleteChannel(channel: Channel) {
		this.timeouts.delete(channel.id)
	}

	public getChannels(): string[] {
		return Object.keys(this.timeouts)
	}

	public getSessionCreatorChannelId() {
		return this.entry.session_creator_channel_id
	}

	public async setSessionCreatorChannelId(
		session_creator_channel_id: string
	) {
		this.entry.session_creator_channel_id = session_creator_channel_id
		await this.ref.update({ session_creator_channel_id })
	}

	public getTimeout() {
		return this.entry.timeout
	}

	public async setTimeout(timeout: number) {
		this.entry.timeout = timeout
		await this.ref.update({ timeout })
	}
}
