import Document, { iDocument } from "./Document"
import { Channel, Client, Guild } from "discord.js"

export default class GuildCache {
	public bot: Client
	public guild: Guild
	public ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
	private document: Document = Document.getEmpty()

	private timeouts: {
		[channelId: string]: NodeJS.Timeout | null
	} = {}

	public constructor(
		bot: Client,
		guild: Guild,
		ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
		resolve: (localCache: GuildCache) => void
	) {
		this.bot = bot
		this.guild = guild
		this.ref = ref
		this.ref.onSnapshot(snap => {
			if (snap.exists) {
				this.document = new Document(snap.data() as iDocument)
				resolve(this)
			}
		})
	}

	public clearDeleteTimeout(channel: Channel) {
		if (this.timeouts[channel.id]) {
			if (this.timeouts[channel.id] !== null) {
				clearTimeout(this.timeouts[channel.id]!)
				this.timeouts[channel.id] = null
			}
		}
		else {
			this.timeouts[channel.id] = null
		}
	}

	public setDeleteTimeout(channel: Channel) {
		this.timeouts[channel.id] = setTimeout(() => {
			channel.delete().catch()
			this.deleteChannel(channel)
		}, this.getTimeout() * 1000)
	}

	public deleteChannel(channel: Channel) {
		delete this.timeouts[channel.id]
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
