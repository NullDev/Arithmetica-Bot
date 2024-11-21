import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
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
        .setDescription(translations.unset_loser_role.desc)
        .setDescriptionLocalizations(translations.unset_loser_role.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await db.set(`guild-${interaction.guildId}.loserRole`, null);
        await db.set(`guild-${interaction.guildId}.loserRoleDuration`, null);

        return await interaction.reply({
            content: await __("replies.unset_loser_role")(interaction.guildId),
            ephemeral: true,
        });
    },
};
