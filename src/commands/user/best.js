import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import defaults from "../../util/defaults.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.best.desc)
        .setDescriptionLocalizations(translations.best.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const guildsBest = await db.get(`guild-${interaction.guildId}.best`);
        const text = await __("replies.best", guildsBest)(interaction.guildId);
        const embed = {
            color: defaults.embed_color,
            title: ":crown:  Highscore",
            description: ":heavy_minus_sign::heavy_minus_sign::heavy_minus_sign: \n" + text + "\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:",
            footer: {
                text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        return await interaction.editReply(
            { embeds: [embed] },
        );
    },
};
