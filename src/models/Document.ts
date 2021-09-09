export interface iDocument {
	session_creator_channel_id: string
	timeout: number
	prefix: string
}

export default class Document {
	public value: iDocument

	public constructor(value: iDocument) {
		this.value = value
	}

	public static getEmpty(): Document {
		return new Document({
			session_creator_channel_id: "",
			timeout: 5,
			prefix: "➤"
		})
	}
}