import Document, { iValue } from "./Document"
import { Channel, Collection, VoiceChannel } from "discord.js"
import { BaseGuildCache } from "discordjs-nova"

export default class GuildCache extends BaseGuildCache<
	iValue,
	Document,
	GuildCache
> {
	public static prefix = "➤" as const
	private readonly timeouts = new Collection<string, NodeJS.Timeout | null>()
	public readonly sessions: VoiceChannel[] = []

	public resolve(resolve: (cache: GuildCache) => void): void {
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.document = new Document(snap.data() as iValue)
				resolve(this)
			}
		})
	}

	public onConstruct() {}

	public updateMinutely(debug: number): void {}

	public generateSessionName(): string {
		for (let i = 0; true; i++) {
			const name = `${GuildCache.prefix} ${i}`
			if (this.sessions.find(s => s.name === name)) {
				continue
			}
			return name
		}
	}

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
				this.sessions.splice(this.sessions.findIndex(s => s.id === channel.id), 1)
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

	public async setSessionCreatorChannelId(
		session_creator_channel_id: string
	) {
		this.document.value.session_creator_channel_id =
			session_creator_channel_id
		await this.ref.update({ session_creator_channel_id })
	}

	public getTimeout() {
		return this.document.value.timeout
	}

	public async setTimeout(timeout: number) {
		this.document.value.timeout = timeout
		await this.ref.update({ timeout })
	}
}
