import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ButtonStyle } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import createYesNoInteraction from "../../events/yesNoInteraction.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const guildDb = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName("cheat-mode")
        .setDescription(translations.cheat_mode.desc)
        .setDescriptionLocalizations(translations.cheat_mode.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription(translations.cheat_mode.options.enabled.desc)
                .setDescriptionLocalizations(translations.cheat_mode.options.enabled.translations)
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("startcount")
                .setDescription(translations.cheat_mode.options.startcount.desc)
                .setDescriptionLocalizations(translations.cheat_mode.options.startcount.translations)
                .setRequired(false)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        if (!interaction.options.get("enabled")?.value){
            await guildDb.set(`guild-${interaction.guildId}.cheatmode`, false);

            await interaction.reply({
                content: await __("replies.cheat_mode.disabled")(interaction.guildId),
            });

            return;
        }

        createYesNoInteraction(interaction, {
            promptText: await __("replies.cheat_mode.are_you_sure")(interaction.guildId),
            yesText: await __("replies.cheat_mode.confirm")(interaction.guildId),
            noText: await __("replies.cheat_mode.abort")(interaction.guildId),
            noStyle: ButtonStyle.Secondary,
            yesStyle: ButtonStyle.Danger,
            showNoFirst: true,
        }).then(async(answer) => {
            if (answer === "yes"){
                const cnt = interaction.options.get("startcount")?.value || 0;

                await guildDb.set(`guild-${interaction.guildId}.cheatmode`, true);
                await guildDb.set(`guild-${interaction.guildId}.count`, cnt);
                await guildDb.delete(`guild-${interaction.guildId}.lastUser`);

                await interaction.followUp({
                    content: await __("replies.cheat_mode.success")(interaction.guildId) + "\nStartcount: " + cnt,
                });
            }
            else if (answer === "no"){
                await interaction.followUp({ content: await __("generic.aborted")(interaction.guildId) });
            }
        });
    },
};
