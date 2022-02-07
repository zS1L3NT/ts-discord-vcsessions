import { BaseEntry } from "nova-bot"

export default interface Entry extends BaseEntry {
	session_creator_channel_id: string
	timeout: number
}
