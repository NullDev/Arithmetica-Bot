import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const guild = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.global_stats.desc)
        .setDescriptionLocalizations(translations.global_stats.translations)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName("type")
                .setDescription(translations.global_stats.options.type.desc)
                .setDescriptionLocalizations(translations.global_stats.options.type.translations)
                .setRequired(false)
                .addChoices({
                    name: translations.global_stats.options.type.choices.current.desc,
                    name_localizations: translations.global_stats.options.type.choices.current.translations,
                    value: "current",
                }, {
                    name: translations.global_stats.options.type.choices.best.desc,
                    name_localizations: translations.global_stats.options.type.choices.best.translations,
                    value: "best",
                })),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const type = interaction.options.get("type")?.value || "current";

        const allCounts = await guild.all();
        const counts = allCounts.map(e => ({ best: e.value.best || 0, count: e.value.count || 0, guildId: e.id.replace("guild-", ""), cheat: !!e.value.cheatmode }))
            .filter(e => !e.cheat);

        if (type === "best") counts.sort((a, b) => b.best - a.best);
        else counts.sort((a, b) => b.count - a.count);

        const rank = (counts.findIndex(e => e.guildId === interaction.guildId) || 0) + 1;
        const currentCountOfGuild = counts.find(e => e.guildId === interaction.guildId)?.count || 0;
        const bestCountOfGuild = counts.find(e => e.guildId === interaction.guildId)?.best || 0;
        const currentGuildName = (await interaction.client.guilds.fetch()).find(e => e.id === interaction.guildId)?.name;
        const allGuilds = await interaction.client.guilds.fetch().then(guilds => guilds.size);

        let reply = await __(`replies.global_top_${type}`, currentGuildName, rank, allGuilds, type === "best" ? bestCountOfGuild : currentCountOfGuild)(interaction.guildId);
        if (rank === 1) reply += " 👑";

        return await interaction.editReply({
            content: (rank === 0 || !currentGuildName)
                ? await __("errors.no_top_stats")(interaction.guildId)
                : reply,
        });
    },
};
