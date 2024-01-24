import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName("last-count")
        .setDescription(translations.last_count.desc)
        .setDescriptionLocalizations(translations.last_count.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const lastCount = await db.get(`guild-${interaction.guildId}.count`) || "0";

        return await interaction.reply({
            content: String(lastCount),
            ephemeral: true,
        });
    },
};
