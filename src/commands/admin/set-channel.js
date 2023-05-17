import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import { QuickDB } from "quick.db";

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
        if (!channel) return await interaction.reply({ content: "Invalid language", ephemeral: true });

        const channelID = interaction.guild?.channels.cache.find(ch => ch.name === channel.value && ch.type === ChannelType.GuildText)?.id;
        if (!channelID) return await interaction.reply({ content: "Invalid channel", ephemeral: true });

        await db.set(`guild-${interaction.guildId}.channel`, channelID);

        return await interaction.reply({ content: "Channel set to: " + channel.value, ephemeral: true });
    },
};
