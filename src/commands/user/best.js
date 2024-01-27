import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
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
        .setName("best")
        .setDescription(translations.best.desc)
        .setDescriptionLocalizations(translations.best.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();
        const guildsBest = await db.get(`guild-${interaction.guildId}.best`);
        return await interaction.editReply(
            await __("replies.best", guildsBest)(interaction.guildId),
        );
    },
};
