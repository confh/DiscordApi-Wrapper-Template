import { SlashCommandBuilder } from "@confis/discordapiwrapper";
import Command from "../classes/Command";

module.exports = new Command({
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View bot commands"),
    async execute(interaction, client) {
        const cmds = client.commands.map(a => {
            const json = a.data.toJson()
            return `**${json.name}**\n - ${json.description}`
        })

        await client.embedPages(interaction, cmds, {
            title: "My commands",
            perPage: 5
        })
    },
})