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

export default {
    data: new SlashCommandBuilder()
        .setName("silent-mode")
        .setDescription(translations.silent_mode.desc)
        .setDescriptionLocalizations(translations.silent_mode.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription(translations.silent_mode.options.enabled.desc)
                .setDescriptionLocalizations(translations.silent_mode.options.enabled.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const enabled = interaction.options.get("enabled");
        if (!enabled){
            return await interaction.reply({
                content: await __("errors.invalid_argument")(interaction.guildId),
                ephemeral: true,
            });
        }

        const isEnabled = Boolean(enabled.value);

        await db.set(`guild-${interaction.guildId}.silent-mode`, isEnabled);

        return await interaction.reply({
            content: await __(
                "replies.silent_mode_set",
                await __("generic." + (isEnabled ? "activated" : "deactivated"))(interaction.guildId),
            )(interaction.guildId),
            ephemeral: true,
        });
    },
};
