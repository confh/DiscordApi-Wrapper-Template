import { ClientEvents } from "@confis/discordapiwrapper"

export default class Event<K extends keyof ClientEvents> {
    name: K
    once: boolean
    execute: (...args: ClientEvents[K]) => any

    constructor(data: {
        name: K
        once: boolean
        execute: (...args: ClientEvents[K]) => any
    }) {
        Object.assign(this, data)
    }
}