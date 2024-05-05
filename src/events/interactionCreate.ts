import { SlashCommandInteraction, EmbedBuilder } from "@confis/discordapiwrapper";
import CustomClient from "../classes/CustomClient";
import Event from "../classes/Event";

module.exports = new Event({
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (interaction instanceof SlashCommandInteraction) {
            try {
                const command = client.commands.find(a => a.data.toJson().name === interaction.name)

                if (!command) return client.logger.error(`Command "${command!!.data.toJson().name}" not found.`);

                await command.execute(interaction, client)
            } catch (e) {
                const embed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor(client.config.colors.error)
                    .setTimestamp()
                    .setDescription(`**Error:**\n${e.message}\n\n**Stack:**\n${e.stack}`)

                if (interaction.acknowledged) {
                    interaction.followUp({
                        embeds: [embed],
                        ephemeral: true
                    })
                } else {
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
            }
        }
    },
})