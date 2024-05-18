import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.list_bans.desc)
        .setDescriptionLocalizations(translations.list_bans.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const guildUsers = (await db.all()).filter(data => data.id.startsWith(`guild-${interaction.guildId}`))[0].value; // @ts-ignore
        const bannedUsers = Object.keys(guildUsers).filter(user => guildUsers[user].banned).map(user => `<@${user.replaceAll("user-", "")}>`);

        await interaction.reply({
            content: bannedUsers.length
                ? bannedUsers.join("\n")
                : await __("replies.no_banns")(interaction.guildId),
            ephemeral: true,
            allowedMentions: { users: [] },
        });
    },
};
