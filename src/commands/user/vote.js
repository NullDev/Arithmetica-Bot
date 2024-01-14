import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export default {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription(translations.vote.desc)
        .setDescriptionLocalizations(translations.vote.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        return await interaction.reply({
            content: "❤️❤️❤️\n<https://discordbotlist.com/bots/arithmetica>\n<https://top.gg/bot/1108279646165942363>\n❤️❤️❤️",
            ephemeral: true,
        });
    },
};
