import { SlashCommandBuilder, SlashCommandInteraction } from "@confis/discordapiwrapper"
import CustomClient from "./CustomClient"

export default class Command {
    public data: SlashCommandBuilder
    public execute: (interaction: SlashCommandInteraction, client: CustomClient) => any

    constructor(options: Command) {
        Object.assign(this, options)
    }
}