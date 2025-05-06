import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.ban_user.desc)
        .setDescriptionLocalizations(translations.ban_user.translations)
        .setContexts([InteractionContextType.Guild])
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription(translations.ban_user.options.user.desc)
                .setDescriptionLocalizations(translations.ban_user.options.user.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const user = interaction.options.get("user");
        const userid = user?.user?.id;
        if (userid === interaction.client.user?.id){
            return await interaction.reply({
                content: await __("errors.bot_ban")(interaction.guildId),
                ephemeral: true,
            });
        }

        const username = user?.user?.username;

        if (!userid || !username){
            return await interaction.reply({
                content: await __("errors.invalid_argument")(interaction.guildId),
                ephemeral: true,
            });
        }

        await db.set(`guild-${interaction.guildId}.user-${userid}.banned`, true);

        return await interaction.reply({
            content: await __("replies.ban_user", username)(interaction.guildId),
            ephemeral: true,
        });
    },
};
