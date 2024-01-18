import { SlashCommandBuilder } from "discord.js";
import __ from "../../service/i18n.js";
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
        const embed = {
            color: 0xff8282,
            title: ":heart: Voting",
            description: (await __("replies.vote.thank_you")(interaction.guildId)) + " :) \n\n<https://discordbotlist.com/bots/arithmetica>\n<https://top.gg/bot/1108279646165942363>",
            footer: {
                text: await __("replies.vote.rewards")(interaction.guildId),
            },
        };

        return await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
