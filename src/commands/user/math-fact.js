import { SlashCommandBuilder } from "discord.js";
import getRandomMathFact from "../../util/mathFact.js";
import translations from "../../../locales/commands/translations.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.math_fact.desc)
        .setDescriptionLocalizations(translations.math_fact.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const embed = {
            color: 0xff8282,
            title: ":abacus:  Random Math Fact",
            description: ":heavy_minus_sign::heavy_minus_sign::heavy_minus_sign: \n" + getRandomMathFact() + "\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:",
            footer: {
                text: `Requested by ${interaction.user.displayName || interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        return await interaction.reply({ embeds: [embed] });
    },
};
