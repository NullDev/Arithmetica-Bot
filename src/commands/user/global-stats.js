import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";

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
        const allCounts = await guild.all();
        const counts = allCounts.map(e => ({ count: e.value.count, guildId: e.id.replace("guild-", "") }));

        counts.sort((a, b) => b.count - a.count);

        const top10 = counts.slice(0, 10);

        const guilds = await interaction.client.guilds.fetch();
        const guildNames = guilds.map(e => ({ name: e.name, guildId: e.id }));

        const top10Names = top10.map(e => ({ name: guildNames.find(g => g.guildId === e.guildId)?.name, count: e.count }));
        const reply = top10Names.map((e, i) => `${i + 1}. ${e.name}: ${e.count} ${i === 0 ? "👑" : ""}`).join("\n");

        return await interaction.reply({ content: reply });
    },
};
