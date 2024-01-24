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
        .setName("toggle-arithmetic")
        .setDescription(translations.toggle_arithmetic.desc)
        .setDescriptionLocalizations(translations.toggle_arithmetic.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("mode")
                .setDescription(translations.toggle_arithmetic.options.select.desc)
                .setDescriptionLocalizations(translations.toggle_arithmetic.options.select.translations)
                .setRequired(false)
                .addChoices({
                    name: translations.toggle_arithmetic.options.select.choices.enabled.desc,
                    name_localizations: translations.toggle_arithmetic.options.select.choices.enabled.translations,
                    value: "enabled",
                }, {
                    name: translations.toggle_arithmetic.options.select.choices.disabled.desc,
                    name_localizations: translations.toggle_arithmetic.options.select.choices.disabled.translations,
                    value: "disabled",
                }, {
                    name: translations.toggle_arithmetic.options.select.choices.mathonly.desc,
                    name_localizations: translations.toggle_arithmetic.options.select.choices.mathonly.translations,
                    value: "mathonly",
                })),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const type = interaction.options.get("mode")?.value;

        if (type === "mathonly"){
            await db.set(`guild-${interaction.guildId}.arithmetic`, true);
            await db.set(`guild-${interaction.guildId}.mathonly`, true);

            return await interaction.reply({
                content: await __("replies.arithmetic_set_mathonly")(interaction.guildId),
                ephemeral: true,
            });
        }
        else if (type === "disabled"){
            await db.set(`guild-${interaction.guildId}.arithmetic`, false);
            await db.set(`guild-${interaction.guildId}.mathonly`, false);

            return await interaction.reply({
                content: await __(
                    "replies.arithmetic_set",
                    await __("generic.deactivated")(interaction.guildId),
                )(interaction.guildId),
                ephemeral: true,
            });
        }
        else if (type === "enabled"){
            await db.set(`guild-${interaction.guildId}.arithmetic`, true);
            await db.set(`guild-${interaction.guildId}.mathonly`, false);

            return await interaction.reply({
                content: await __(
                    "replies.arithmetic_set",
                    await __("generic.activated")(interaction.guildId),
                )(interaction.guildId),
                ephemeral: true,
            });
        }

        return await interaction.reply({
            content: await __("errors.invalid_argument")(interaction.guildId),
            ephemeral: true,
        });
    },
};
