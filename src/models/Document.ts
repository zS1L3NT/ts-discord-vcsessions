import { BaseDocument } from "discordjs-nova"

export interface iValue {
	session_creator_channel_id: string
	timeout: number
}

export default class Document extends BaseDocument<iValue, Document> {
	public getEmpty(): Document {
		return new Document({
			session_creator_channel_id: "",
			timeout: 5
		})
	}
}
