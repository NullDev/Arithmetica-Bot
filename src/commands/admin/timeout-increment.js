import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
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
        .setName("timeout-increment")
        .setDescription(translations.timeout_increment.desc)
        .setDescriptionLocalizations(translations.timeout_increment.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption((option) =>
            option.setName("factor")
                .setMinValue(1)
                .setDescription(translations.timeout_increment.options.factor.desc)
                .setDescriptionLocalizations(translations.timeout_increment.options.factor.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        let factor = Number(interaction.options.get("factor")?.value);
        if (!factor || isNaN(factor)) factor = 1;
        await db.set(`guild-${interaction.guildId}.timeout-factor`, factor || 1);
        return await interaction.reply({
            content: factor === 1
                ? await __("replies.timeout_factor_disabled")(interaction.guildId)
                : await __("replies.timeout_factor_set", factor)(interaction.guildId),
            ephemeral: true,
        });
    },
};
