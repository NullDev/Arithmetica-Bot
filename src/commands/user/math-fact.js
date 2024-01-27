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
        const fact = getRandomMathFact();
        return await interaction.reply({ content: fact });
    },
};
