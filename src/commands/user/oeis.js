import { SlashCommandBuilder, InteractionContextType } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.oeis.desc)
        .setDescriptionLocalizations(translations.oeis.translations)
        .setContexts([InteractionContextType.Guild])
        .addStringOption((option) =>
            option.setName("sequence")
                .setDescription(translations.oeis.options.sequence.desc)
                .setDescriptionLocalizations(translations.oeis.options.sequence.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const seq = interaction.options.get("sequence")?.value;
        if (!seq) return await interaction.editReply({ content: await __("errors.invalid_argument")(interaction.guildId) });

        const f = await fetch(`https://oeis.org/search?q=${seq}&fmt=json`);

        console.log(f);

        const results = await f.json();

        if (!results || !results.length) return await interaction.editReply({ content: "¯\\_(ツ)_/¯" });

        const first5 = results.slice(0, 5);

        let res = "Sequence: " + seq + "\n\n";
        first5.forEach((r, i) => {
            const sequenceId = "A" + String(r.number).padStart(6, "0");
            res += `**${i + 1}.** ${r.name.replaceAll("*", "\\*").replaceAll("_", "\\_").replaceAll("`", "\\`")} `;
            if (!!r.formula && !!r.formula.length && !!r.formula[0]) res += `- ${r.formula[0].replaceAll("*", "\\*").replaceAll("_", "\\_").replaceAll("`", "\\`")} - `;
            res += `([${sequenceId}](<https://oeis.org/${sequenceId}>))\n`;
        });

        return await interaction.editReply({
            content: res,
        });
    },
};
