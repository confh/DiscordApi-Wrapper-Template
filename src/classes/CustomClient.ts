import Command from "./Command"
import path from "node:path"
import fs from "node:fs"
import express from "express"
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyles, Client, ComponentTypes, EmbedBuilder, FieldOptions, Interaction, Message, User, } from "@confis/discordapiwrapper"
const app = express()

export default class CustomClient extends Client {
    private rest_commands: any[] = []
    public commands: Command[] = []
    public config = {
        colors: {
            normal: "#313338",
            error: "#ED4245",
            success: "#57f287"
        }
    }

    /**
     * Deploying website
     */
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

    async embedPages(interaction: Interaction, array: string[], options: {
        title?: string,
        footer?: string,
        footerImage?: string,
        color?: number,
        perPage?: number,
        thumbnail?: string,
        header?: string,
        fields?: FieldOptions[],
        joinBy?: string,
        author?: string,
        authorImage?: string,
        timestamp?: boolean,
        user?: User,
        ephemeral?: boolean,
        url?: string,
        followUp?: boolean,
        page?: number,
        emojis?: {
            first_track: string,
            previous_track: string,
            next_track: string,
            last_track: string,
            delete: string,
            jump_to: string
        },
        endText?: string | null
    }) {
        const client = this
        let footer = options.footer || '',
            title = options.title || null,
            pagee = options.page || 1,
            footerImage = options.footerImage || null,
            color = options.color || client.config.colors.normal,
            perPage = options.perPage || 4,
            thumbnail = options.thumbnail || null,
            header = options.header || '',
            fields = options.fields || [],
            joinBy = options.joinBy || '\n',
            ephemeral = options.ephemeral || false,
            author = options.author || null,
            authorImage = options.authorImage || null,
            timestamp = options.timestamp || false,
            user = options.user || interaction.member,
            followUp = options.followUp || false,
            emojis = options.emojis || {
                first_track: '<:first_page:1094405588013817997>',
                previous_track: '<:previous_page:1094405958706397264>',
                next_track: '<:next_page:1094405709535395840>',
                last_track: '<:last_page:1094405473417048095>',
                delete: '🗑',
                jump_to: '↗️'
            },
            url = options.url || null,
            endText = options.endText || null
        let page = pagee;

        if (page > Math.ceil(array.length / perPage) || page < 1) page = 1

        let first = perPage * (parseInt(page.toString()) - 1)
        let second = perPage * parseInt(page.toString())
        const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(`${header ? `${header}\n` : ""}${array.slice(first, second).join(joinBy)}\n${endText ? endText : ""}`)

        if (thumbnail) {
            embed.setThumbnail({ url: thumbnail })
        }

        if (fields) {
            embed.setFields(fields)
        }

        if (author?.length) {
            embed.setAuthor({
                name: author,
                icon_url: authorImage || undefined
            })
        }

        if (title) embed.setTitle(title)

        if (footer.length) {
            embed.setFooter({
                text: `${footer}`,
                icon_url: footerImage || undefined
            })
        }

        if (Math.ceil(array.length / perPage) > 1) embed.setFooter({
            text: `Page: ${page}/${Math.ceil(array.length / perPage)}`,
            icon_url: footerImage || undefined
        })


        if (timestamp) embed.setTimestamp()
        if (url) embed.setURL(url)

        let buttons = [
            new ButtonBuilder()
                .setCustomid('first_track')
                .setStyle(ButtonStyles.SECONDARY)
                .setEmoji(emojis.first_track),

            new ButtonBuilder()
                .setCustomid('previous_track')
                .setStyle(ButtonStyles.SECONDARY)
                .setEmoji(emojis.previous_track),
        ]

        buttons.push(
            new ButtonBuilder()
                .setCustomid('next_track')
                .setStyle(ButtonStyles.SECONDARY)
                .setEmoji(emojis.next_track)
        )

        buttons.push(
            new ButtonBuilder()
                .setCustomid('last_track')
                .setStyle(ButtonStyles.SECONDARY)
                .setEmoji(emojis.last_track))

        buttons.push(
            new ButtonBuilder()
                .setCustomid('delete')
                .setStyle(ButtonStyles.SECONDARY)
                .setEmoji(emojis.delete))



        const row = new ActionRowBuilder()
            .setComponentsArray(
                buttons
            )

        let message: Message;

        let comp = [row]

        if (array.length < perPage) comp = []

        if (!followUp) {
            message = await interaction.reply({
                embeds: [embed],
                components: comp,
            })
        } else {
            message = await interaction.followUp({
                embeds: [embed],
                components: comp,
            })
        }

        if (array.length < perPage) return embed

        const collector = message.createComponentCollector({
            timeout: 60_000,
            component_type: ComponentTypes.BUTTON
        })

        collector.on("collect", async (i: ButtonInteraction) => {
            if (i.member?.id != user?.id) return i.reply({ content: `These buttons aren't for you. Use </${interaction.name}:${interaction.interaction_id}> for your menu.`, ephemeral: true })
            collector.resetTimer()
            const reactionadd = array.slice(first + perPage, second + perPage).length;
            const reactionremove = array.slice(first - perPage, second - perPage).length;
            await i.defer()
            if (i.custom_id === "next_track" && reactionadd !== 0) {
                page++

                first += perPage;
                second += perPage;
                embed.setDescription(`${header ? `${header}\n` : ""}${array.slice(first, second).join(joinBy)}\n${endText ? endText : ""}`);
                embed.setFooter({
                    text: `${footer.length ? `${footer} |` : ''} Page: ${page}/${Math.ceil(array.length / perPage)}`,
                    icon_url: footerImage || undefined
                });
                interaction.edit({
                    embeds: [embed],
                    components: comp
                })
            } else if (i.custom_id === "previous_track" && reactionremove !== 0) {
                page--
                first -= perPage;
                second -= perPage;
                embed.setDescription(`${header ? `${header}\n` : ""}${array.slice(first, second).join(joinBy)}\n${endText ? endText : ""}`);
                embed.setFooter({
                    text: `${footer.length ? `${footer} |` : ''} Page: ${page}/${Math.ceil(array.length / perPage)}`,
                    icon_url: footerImage || undefined
                });
                interaction.edit({
                    embeds: [embed],
                    components: comp
                })
            } else if (i.custom_id === "first_track") {
                page = 1;
                first = 0;
                second = perPage;
                embed.setDescription(`${header ? `${header}\n` : ""}${array.slice(first, second).join(joinBy)}\n${endText ? endText : ""}`);
                embed.setFooter({
                    text: `${footer.length ? `${footer} |` : ''} Page: ${page}/${Math.ceil(array.length / perPage)}`,
                    icon_url: footerImage || undefined
                });
                interaction.edit({
                    embeds: [embed],
                    components: comp
                })
            } else if (i.custom_id === "last_track") {
                page = Math.ceil(array.length / perPage);
                first = (page * perPage) - perPage;
                second = page * perPage;
                embed.setDescription(`${header ? `${header}\n` : ""}${array.slice(first, second).join(joinBy)}\n${endText ? endText : ""}`);
                embed.setFooter({
                    text: `${footer.length ? `${footer} |` : ''} Page: ${page}/${Math.ceil(array.length / perPage)}`,
                    icon_url: footerImage || undefined
                });
                interaction.edit({
                    embeds: [embed],
                    components: comp
                })
            } else if (i.custom_id === "delete") {
                collector.end()
            }
        })

        collector.on("end", () => {
            row.components.forEach((component: ButtonBuilder) => {
                component.setDisabled(true)
                component.setStyle(ButtonStyles.SECONDARY)
            })
            interaction.edit({
                components: [row]
            });
        })
    }

}