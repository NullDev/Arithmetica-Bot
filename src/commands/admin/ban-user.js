import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName("ban-user")
        .setDescription(translations.ban_user.desc)
        .setDescriptionLocalizations(translations.ban_user.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription(translations.ban_user.options.user.desc)
                .setDescriptionLocalizations(translations.ban_user.options.user.translations)
                .setRequired(false)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const user = interaction.options.get("user");
        const userid = user?.user?.id;
        const username = user?.user?.username;

        await db.set(`guild-${interaction.guildId}.user-${userid}.banned`, true);

        await interaction.reply({
            content: await __("replies.ban_user", username)(interaction.guildId),
            ephemeral: true,
        });
    },
};
