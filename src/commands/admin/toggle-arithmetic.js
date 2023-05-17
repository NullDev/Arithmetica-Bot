import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName("toggle-arithmetic")
        .setDescription("Arithmetic expressions enabled?")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription("Enable arithmetic expressions")
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const enabled = interaction.options.get("enabled");
        if (!enabled) return await interaction.reply({ content: "Invalid option", ephemeral: true });

        await db.set(`guild-${interaction.guildId}.arithmetic`, enabled.value);

        return await interaction.reply({ content: "Arithmetic expressions set to: " + enabled.value, ephemeral: true });
    },
};
