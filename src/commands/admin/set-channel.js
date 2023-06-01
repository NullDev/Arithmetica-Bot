import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription(translations.set_channel.desc)
        .setDescriptionLocalizations(translations.set_channel.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("channel")
                .setDescription(translations.set_channel.options.channel.desc)
                .setDescriptionLocalizations(translations.set_channel.options.channel.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const channel = interaction.options.get("channel");
        if (!channel){
            return await interaction.reply({
                content: await __("errors.invalid_argument")(interaction.guildId),
                ephemeral: true,
            });
        }

        const channelID = interaction.guild?.channels.cache.find(ch => ch.name === channel.value && ch.type === ChannelType.GuildText)?.id;
        if (!channelID){
            return await interaction.reply({
                content: await __("errors.channel_not_found")(interaction.guildId),
                ephemeral: true,
            });
        }

        await db.set(`guild-${interaction.guildId}.channel`, channelID);
        await db.delete(`guild-${interaction.guildId}.lastUser`);
        await db.set(`guild-${interaction.guildId}.count`, 0);

        return await interaction.reply({
            content: await __("replies.channel_set", channel.value)(interaction.guildId),
            ephemeral: true,
        });
    },
};
