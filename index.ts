import Client from "./DiscordApiWrapper/Client";
import EmbedBuilder from "./DiscordApiWrapper/classes/EmbedBuilder";
import { SlashCommandInteraction } from "./DiscordApiWrapper/classes/Interaction";
import SlashCommandBuilder from "./DiscordApiWrapper/classes/SlashCommandBuilder";
require('dotenv').config()
import express from "express"
const app = express()

const client = new Client(process.env.TOKEN as string, {
    cacheAllUsers: true
})

client.on("ready", () => {
    console.log("ready")
    app.get("/", (req, res) => {
        res.send("Bot is online")
    })
    app.listen(process.env.PORT || 10000, () => {
        console.log("server is on")
    })
    client.editStatus("dnd")
    client.setGlobalCommands(
        new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Ping the bot.")
    )
})

client.on("interactionCreate", async (i) => {
    if (i instanceof SlashCommandInteraction) {
        if (i.name === "ping") {
            const msg = await i.channel.send("Calculating ping...")
            const ping = Math.abs(msg.timestamp - Date.now())
            await msg.delete()

            const embed = new EmbedBuilder()
                .setTitle("Poing")
                .setDescription(`**Ping:** ${ping}ms`)
                .setFooter({
                    text: client.user.displayName as string,
                    icon_url: client.user.getAvatarURL({ size: 1024 })
                })
                .setTimestamp()

            await i.reply({
                content: "",
                embeds: [embed],
            })
        }
    }
})

client.connect()