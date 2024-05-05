import CustomClient from "./classes/CustomClient";
require('dotenv').config()
import path from "node:path"
import fs from "node:fs"
import Event from "./classes/Event"
import { Intents } from "@confis/discordapiwrapper";
const logger = require("./logger")

const client = new CustomClient(process.env.TOKEN as string, {
    cacheAllUsers: true,
    intents: [Intents.ALL]
})

client.setDefaultLogger(logger)

const eventPath = path.join(__dirname, "events")
const eventFiles = fs.readdirSync(eventPath).filter((file: string) => file.endsWith('.ts'));

for (let i = 0; i < eventFiles.length; i++) {
    const eventFile = path.join(eventPath, eventFiles[i]);
    const event = require(eventFile) as Event<any>
    if (!event.once) {
        client.on(event.name, async (...args) => {
            try {
                event.execute(...args, client)
            } catch (e) {
                client.logger.error(e.message)
            }
        })
    } else {
        client.once(event.name, async (...args) => {
            try {
                event.execute(...args, client)
            } catch (e) {
                client.logger.error(e.message)
            }
        })
    }

}

client.connect()