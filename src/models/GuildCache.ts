import Document, { iValue } from "./Document"
import { Channel, Collection } from "discord.js"
import { BaseGuildCache } from "discordjs-nova"

export default class GuildCache extends BaseGuildCache<Entry, GuildCache> {
	private timeouts!: Collection<string, NodeJS.Timeout | null>

	public resolve(resolve: (cache: GuildCache) => void): void {
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.document = new Document(snap.data() as iValue)
				resolve(this)
			}
		})
	}

	public onConstruct() {
		this.timeouts = new Collection<string, NodeJS.Timeout | null>()
	}

	public updateMinutely(debug: number): void {
	}

	public clearDeleteTimeout(channel: Channel) {
		if (this.timeouts.get(channel.id)) {
			if (this.timeouts.get(channel.id) !== null) {
				clearTimeout(this.timeouts.get(channel.id)!)
				this.timeouts.set(channel.id, null)
			}
		}
		else {
			this.timeouts.set(channel.id, null)
		}
	}

	public setDeleteTimeout(channel: Channel) {
		this.timeouts.set(
			channel.id,
			setTimeout(() => {
				channel.delete().catch(() => {
				})
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
		return this.document.value.session_creator_channel_id
	}

	public async setSessionCreatorChannelId(session_creator_channel_id: string) {
		this.document.value.session_creator_channel_id = session_creator_channel_id
		await this.ref.update({ session_creator_channel_id })
	}

	public getPrefix() {
		return this.document.value.prefix
	}

	public async setPrefix(prefix: string) {
		this.document.value.prefix = prefix
		await this.ref.update({ prefix })
	}

	public getTimeout() {
		return this.document.value.timeout
	}

	public async setTimeout(timeout: number) {
		this.document.value.timeout = timeout
		await this.ref.update({ timeout })
	}
}
