import { SlashCommandBuilder, EmbedBuilder } from "@confis/discordapiwrapper";
import Command from "../classes/Command";

module.exports = new Command({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("See the bot ping."),
    async execute(interaction, client) {
        const msg = await interaction.channel.send("Calculating ping...")
        const ping = Math.abs(msg.timestamp - Date.now())
        await msg.delete()

        const embed = new EmbedBuilder()
            .setTitle("Poing")
            .setDescription(`**Ping:** \`${ping}ms\``)
            .setFooter({
                text: client.user.displayName as string,
                icon_url: client.user.getAvatarURL({ size: 1024 })
            })
            .setColor(client.config.colors.normal)
            .setTimestamp()

        await interaction.reply({
            embeds: [embed],
        })
    },
})