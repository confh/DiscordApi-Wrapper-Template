import Client from "../DiscordApiWrapper/Client"
import Command from "./Command"
import path from "node:path"
import fs from "node:fs"
import express from "express"
const app = express()

export default class CustomClient extends Client {
    private rest_commands: any[] = []
    public commands: Command[] = []
    public config = {
        colors: {
            normal: 3224376,
            error: 15548997,
            success: 5763719
        }
    }

    async deployWebsite() {
        app.get("/", (req, res) => {
            res.send("Bot is online")
        })
        app.listen(process.env.PORT || 10000, () => {
            this.logger.info(`Server started! Listening on port ${process.env.PORT || 10000}.`)
        })
    }

    /**
     * Register commands
     */
    async deployCommands() {
        const commandsPath = path.join(__dirname, "..", "commands")
        const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
        for (let i = 0; i < commandFiles.length; i++) {
            const commandFile = path.join(commandsPath, commandFiles[i]);
            const importedCommand = require(commandFile) as Command
            this.commands.push(importedCommand)
            this.rest_commands.push(importedCommand.data)
        }
        this.setGlobalCommands(this.rest_commands)
        this.logger.info(`Successfully deployed ${this.rest_commands.length} commands.`)
    }

}