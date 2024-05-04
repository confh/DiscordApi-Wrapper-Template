import Event from "../classes/Event";
import CustomClient from "../classes/CustomClient";
import express from "express"
const app = express()

module.exports = new Event({
    name: "ready",
    once: true,
    execute(client: CustomClient) {
        client.logger.info(`${client.user.displayName} IS ON!`)
        client.editStatus("dnd")
        client.deployCommands()
        app.get("/", (req, res) => {
            res.send("Bot is online")
        })
        app.listen(process.env.PORT || 10000, () => {
            console.log("server is on")
        })
    }
})