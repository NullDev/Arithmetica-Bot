import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } from "discord.js";
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
        .setDescription(translations.set_timeout.desc)
        .setDescriptionLocalizations(translations.set_timeout.translations)
        .setContexts([InteractionContextType.Guild])
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option.setName("timeout")
                .setDescription(translations.set_timeout.options.timeout.desc)
                .setDescriptionLocalizations(translations.set_timeout.options.timeout.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        let timeout = Number(interaction.options.get("timeout")?.value);
        if (!timeout || isNaN(timeout)) timeout = defaults.timeout_minutes;
        await db.set(`guild-${interaction.guildId}.timeout`, timeout);
        return await interaction.reply({
            content: timeout === 0
                ? await __("replies.timeout_disabled")(interaction.guildId)
                : await __("replies.timeout_set", timeout)(interaction.guildId),
            ephemeral: true,
        });
    },
};
