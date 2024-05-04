import { SlashCommandBuilder, SlashCommandInteraction } from "../DiscordApiWrapper/types"
import CustomClient from "./CustomClient"

export default class Command {
    public data: SlashCommandBuilder
    public execute: (interaction: SlashCommandInteraction, client: CustomClient) => any

    constructor(options: Command) {
        Object.assign(this, options)
    }
}