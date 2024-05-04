import Client from "./DiscordApiWrapper/Client";
import { SlashCommandInteraction } from "./DiscordApiWrapper/classes/Interaction";
import SlashCommandBuilder from "./DiscordApiWrapper/classes/SlashCommandBuilder";
require('dotenv').config()

const client = new Client(process.env.TOKEN as string, {
    cacheAllUsers: true
})

client.on("ready", () => {
    console.log("ready")
    client.setGlobalCommands([
        new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Ping the bot.")
    ])
})

client.on("interactionCreate", (i) => {
    if (i instanceof SlashCommandInteraction) {
        if (i.name === "ping") {
            i.reply("Pong!")
        }
    }
})

client.connect()