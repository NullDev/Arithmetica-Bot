import path from "node:path";
import fs from "node:fs";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Get all available languages
 *
 * @return {Array<{ name: string, value: string }>}
 */
const getLanguages = function(){
    const languages = fs.readdirSync(path.resolve("./locales"));

    return languages.filter((lang) => lang.endsWith(".json")).map((lang) => ({
        name: lang.split("_")[0],
        value: lang.split(".")[0],
    }));
};

export default {
    data: new SlashCommandBuilder()
        .setName("set-language")
        .setDescription(translations.set_language.desc)
        .setDescriptionLocalizations(translations.set_language.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("language")
                .setDescription(translations.set_language.options.language.desc)
                .setDescriptionLocalizations(translations.set_language.options.language.translations)
                .setRequired(true)
                .addChoices(...getLanguages())),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const lang = interaction.options.get("language");
        if (!lang) return await interaction.reply({ content: "Invalid language", ephemeral: true });
        await db.set(`guild-${interaction.guildId}.locale`, lang.value || "English_en");
        return await interaction.reply({ content: "Language set to: " + lang.value, ephemeral: true });
    },
};
