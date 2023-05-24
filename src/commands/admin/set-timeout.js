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
        .setName("set-timeout")
        .setDescription("Configure a timeout for losers")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addIntegerOption((option) =>
            option.setName("timeout")
                .setDescription("Timeout in minutes or 0 to disable")
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        let timeout = Number(interaction.options.get("timeout")?.value);
        if (!timeout || isNaN(timeout)) timeout = 0;
        await db.set(`guild-${interaction.guildId}.timeout`, timeout || 0);
        return await interaction.reply({
            content: timeout === 0
                ? await __("replies.timeout_disabled")(interaction.guildId)
                : await __("replies.timeout_set", timeout)(interaction.guildId),
            ephemeral: true,
        });
    },
};
