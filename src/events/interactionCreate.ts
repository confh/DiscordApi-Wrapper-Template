import { SlashCommandInteraction } from "../DiscordApiWrapper/classes/Interaction";
import CustomClient from "../classes/CustomClient";
import Event from "../classes/Event";

module.exports = new Event({
    name: "interactionCreate",
    once: false,
    execute(interaction, client: CustomClient) {
        if (interaction instanceof SlashCommandInteraction) {
            try {
                const command = client.commands.find(a => a.data.toJson().name === interaction.name)

                if (!command) return client.logger.error(`Command "${command!!.data.toJson().name}" not found.`);

                command.execute(interaction, client)
            } catch (e) {
                interaction.reply(`Error: **${e.message}**`)
            }
        }
    },
})