import { ClientEvents } from "@confis/discordapiwrapper"
import CustomClient from "./CustomClient"

export default class Event<K extends keyof ClientEvents> {
    name: K
    once: boolean
    execute: (client: CustomClient, ...args: ClientEvents[K]) => any

    constructor(data: {
        name: K
        once: boolean
        execute: (client: CustomClient, ...args: ClientEvents[K]) => any
    }) {
        Object.assign(this, data)
    }
}