import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType } from "discord.js";
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
        .setDescription(translations.pin_highscore.desc)
        .setDescriptionLocalizations(translations.pin_highscore.translations)
        .setContexts([InteractionContextType.Guild])
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription(translations.pin_highscore.options.enabled.desc)
                .setDescriptionLocalizations(translations.pin_highscore.options.enabled.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const enabled = interaction.options.get("enabled")?.value;

        await db.set(`guild-${interaction.guildId}.pin-highscore`, enabled);

        return await interaction.reply({
            content: await __("replies.pin_highscore",
                await __("generic." + (enabled ? "activated" : "deactivated"))(interaction.guildId),
            )(interaction.guildId),
            ephemeral: true,
        });
    },
};
