import { SlashCommandInteraction } from "../DiscordApiWrapper/classes/Interaction"
import SlashCommandBuilder from "../DiscordApiWrapper/classes/SlashCommandBuilder"
import CustomClient from "./CustomClient"

export default class Command {
    public data: SlashCommandBuilder
    public execute: (interaction: SlashCommandInteraction, client: CustomClient) => any

    constructor(options: Command) {
        Object.assign(this, options)
    }
}