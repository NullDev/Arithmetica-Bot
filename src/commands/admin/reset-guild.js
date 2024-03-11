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

const userDb = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.reset_guild.desc)
        .setDescriptionLocalizations(translations.reset_guild.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        createYesNoInteraction(interaction, {
            promptText: await __("replies.reset_guild.are_you_sure")(interaction.guildId),
            yesText: await __("replies.reset_guild.confirm")(interaction.guildId),
            noText: await __("replies.reset_guild.abort")(interaction.guildId),
            noStyle: ButtonStyle.Secondary,
            yesStyle: ButtonStyle.Danger,
            showNoFirst: true,
        }).then(async(answer) => {
            if (answer === "yes"){
                await guildDb.delete(`guild-${interaction.guildId}.lastUser`);
                await guildDb.set(`guild-${interaction.guildId}.count`, 0);
                await guildDb.set(`guild-${interaction.guildId}.best`, 0);
                await guildDb.set(`guild-${interaction.guildId}.lastCountString`, "");
                await userDb.delete(`guild-${interaction.guildId}`);

                await interaction.followUp({ content: await __("replies.reset_guild.success")(interaction.guildId) });
            }
            else if (answer === "no"){
                await interaction.followUp({ content: await __("generic.aborted")(interaction.guildId) });
            }
        });
    },
};
