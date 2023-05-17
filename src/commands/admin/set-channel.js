import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { QuickDB } from "quick.db";
import __ from "../../service/i18n";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription("Sets the couting channel.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName("channel")
                .setDescription("Channel name")
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

        return await interaction.reply({
            content: await __("replies.channel_set", channel.value)(interaction.guildId),
            ephemeral: true,
        });
    },
};
