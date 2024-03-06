import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

const settings = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.stats.desc)
        .setDescriptionLocalizations(translations.stats.translations)
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription(translations.stats.options.user.desc)
                .setDescriptionLocalizations(translations.stats.options.user.translations)
                .setRequired(false)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const cheatModeOn = await settings.get(`guild-${interaction.guildId}.cheatmode`);
        if (cheatModeOn) return await interaction.editReply(await __("errors.cheat_mode_enabled")(interaction.guildId));

        const user = interaction.options.get("user");
        if (user?.user?.bot){
            return await interaction.editReply({
                content: await __("errors.stats_on_bot")(interaction.guildId),
            });
        }

        const userid = user?.user?.id || interaction.user.id;
        const wins = (await db.get(`guild-${interaction.guildId}.user-${userid}.counting-wins`)) || 0;
        const fails = (await db.get(`guild-${interaction.guildId}.user-${userid}.counting-fails`)) || 0;
        const mathcounts = (await db.get(`guild-${interaction.guildId}.user-${userid}.counting-math`)) || 0;

        const stats = `✅ ${
            await __("replies.stats.wins")(interaction.guildId)
        }: \`${wins}\`\n❌ ${
            await __("replies.stats.fails")(interaction.guildId)
        }: \`${fails}\`\n🧮 ${
            await __("replies.stats.math")(interaction.guildId)
        }: \`${mathcounts}\``;

        const title = !user?.user?.id
            ? await __("replies.stats.your_stats")(interaction.guildId)
            : await __("replies.stats.stats_for", user.user.displayName ?? user.user.username)(interaction.guildId);

        const embed = {
            color: 0xff8282,
            title: ":bar_chart:  " + title,
            description: ":heavy_minus_sign::heavy_minus_sign::heavy_minus_sign: \n" + stats + "\n:heavy_minus_sign::heavy_minus_sign::heavy_minus_sign:",
            footer: {
                text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        return await interaction.editReply(
            { embeds: [embed] },
        );
    },
};
