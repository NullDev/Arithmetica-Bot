import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
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
        .setDescription("Arithmetic expressions enabled?")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription("Enable arithmetic expressions")
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

        await db.set(`guild-${interaction.guildId}.arithmetic`, isEnabled);

        return await interaction.reply({
            content: await __(
                "replies.arithmetic_set",
                await __("generic." + (isEnabled ? "activated" : "deactivated"))(interaction.guildId),
            )(interaction.guildId),
            ephemeral: true,
        });
    },
};
