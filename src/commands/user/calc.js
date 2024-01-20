import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import mathEval from "../../util/mathEval.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export default {
    data: new SlashCommandBuilder()
        .setName("calc")
        .setDescription(translations.calc.desc)
        .setDescriptionLocalizations(translations.calc.translations)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName("expression")
                .setDescription(translations.calc.options.expression.desc)
                .setDescriptionLocalizations(translations.calc.options.expression.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const expr = interaction.options.get("expression")?.value;
        if (!expr) return await interaction.editReply({ content: await __("errors.invalid_argument")(interaction.guildId) });

        const result = mathEval(String(expr));

        return await interaction.editReply({
            content: result !== null
                ? "`" + expr + "`:\n" + String(result)
                : await __("errors.invalid_argument")(interaction.guildId),
        });
    },
};
