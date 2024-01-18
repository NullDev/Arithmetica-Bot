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

export default {
    data: new SlashCommandBuilder()
        .setName("cooldown")
        .setDescription(translations.cooldown.desc)
        .setDescriptionLocalizations(translations.cooldown.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option.setName("timeout")
                .setDescription(translations.cooldown.options.timeout.desc)
                .setDescriptionLocalizations(translations.cooldown.options.timeout.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        let timeout = Number(interaction.options.get("timeout")?.value);
        if (!timeout || isNaN(timeout)) timeout = defaults.new_member_cooldown;
        await db.set(`guild-${interaction.guildId}.new-member-cooldown`, timeout);
        return await interaction.reply({
            content: timeout === 0
                ? await __("replies.cooldown_disabled")(interaction.guildId)
                : await __("replies.cooldown_set", timeout)(interaction.guildId),
            ephemeral: true,
        });
    },
};
