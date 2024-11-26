import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const guildDb = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.set_last_count.desc)
        .setDescriptionLocalizations(translations.set_last_count.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option.setName("count")
                .setDescription(translations.set_last_count.options.count.desc)
                .setDescriptionLocalizations(translations.set_last_count.options.count.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const cnt = interaction.options.get("count")?.value || 0;

        await guildDb.set(`guild-${interaction.guildId}.count`, cnt);
        await guildDb.delete(`guild-${interaction.guildId}.lastUser`);

        await interaction.reply({
            content: await __("replies.set_last_count", cnt)(interaction.guildId),
            ephemeral: true,
        });
    },
};
