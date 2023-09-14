import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export default {
    data: new SlashCommandBuilder()
        .setName("oeis")
        .setDescription(translations.oeis.desc)
        .setDescriptionLocalizations(translations.oeis.translations)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName("sequence")
                .setDescription(translations.oeis.options.sequence.desc)
                .setDescriptionLocalizations(translations.oeis.options.sequence.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const seq = interaction.options.get("sequence")?.value;
        if (!seq) return await interaction.reply({ content: await __("errors.invalid_argument")(interaction.guildId) });

        const { results } = await fetch(`https://oeis.org/search?q=${seq}&fmt=json`).then((r) => r.json());
        if (!results || !results.length) return await interaction.reply({ content: "¯\\_(ツ)_/¯" });

        const first5 = results.slice(0, 5);

        let res = "Sequence: " + seq + "\n\n";
        first5.forEach((r, i) => {
            const sequenceId = "A" + String(r.number).padStart(6, "0");
            res += `**${i + 1}.** ${sequenceId} `;
            if (!!r.formula && !!r.formula.length && !!r.formula[0]) res += `\`${r.formula[0]}\` `;
            res += `([${r.id}](<https://oeis.org/${sequenceId}>))\n`;
        });

        return await interaction.reply({
            content: res,
        });
    },
};