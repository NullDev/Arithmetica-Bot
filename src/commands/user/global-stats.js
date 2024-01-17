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

export default {
    data: new SlashCommandBuilder()
        .setName("global-stats")
        .setDescription(translations.global_stats.desc)
        .setDescriptionLocalizations(translations.global_stats.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const allCounts = await guild.all();
        const counts = allCounts.map(e => ({ count: e.value.count, guildId: e.id.replace("guild-", ""), cheat: e.value.cheatmode }))
            .filter(e => !e.cheat);

        counts.sort((a, b) => b.count - a.count);

        /*
        const top10 = counts.slice(0, 10);

        const guilds = await interaction.client.guilds.fetch();
        const guildNames = guilds.map(e => ({ name: e.name, guildId: e.id }));

        const top10Names = top10.map(e => ({ name: guildNames.find(g => g.guildId === e.guildId)?.name, count: e.count }));

        const reply = top10Names.map((e, i) => `${i + 1}. ${e.name}: ${e.count} ${i === 0 ? "👑" : ""}`).join("\n");
        */

        const rank = (counts.findIndex(e => e.guildId === interaction.guildId) || 0) + 1;
        const currentGuildName = (await interaction.client.guilds.fetch()).find(e => e.id === interaction.guildId)?.name;
        const allGuilds = await interaction.client.guilds.fetch().then(guilds => guilds.size);

        let reply = await __("replies.global_top", currentGuildName, rank, allGuilds)(interaction.guildId);
        if (rank === 1) reply += " 👑";

        return await interaction.editReply({
            content: (rank === 0 || !currentGuildName)
                ? await __("errors.no_top_stats")(interaction.guildId)
                : reply,
        });
    },
};
