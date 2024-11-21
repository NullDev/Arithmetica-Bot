import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
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
        .setDescription(translations.set_loser_role.desc)
        .setDescriptionLocalizations(translations.set_loser_role.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption((option) =>
            option.setName("role")
                .setDescription(translations.set_loser_role.options.role.desc)
                .setDescriptionLocalizations(translations.set_loser_role.options.role.translations)
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("duration")
                .setDescription(translations.set_loser_role.options.duration.desc)
                .setDescriptionLocalizations(translations.set_loser_role.options.duration.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const role = interaction.options.get("role")?.value;
        const duration = interaction.options.get("duration")?.value || defaults.loser_role_duration;

        if (!role || !duration){
            return await interaction.reply({
                content: await __("errors.invalid_argument")(interaction.guildId),
                ephemeral: true,
            });
        }

        await db.set(`guild-${interaction.guildId}.loserRole`, role);
        await db.set(`guild-${interaction.guildId}.loserRoleDuration`, duration);

        const rolename = (await interaction.guild?.roles.fetch(String(role))?.catch(() => null))?.name;

        return await interaction.reply({
            content: await __("replies.set_loser_role", rolename, duration)(interaction.guildId),
            ephemeral: true,
        });
    },
};
