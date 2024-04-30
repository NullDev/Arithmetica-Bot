import os from "node:os";
import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.info.desc)
        .setDescriptionLocalizations(translations.info.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const count = interaction.guild?.memberCount || "N/A";
        const boosts = interaction.guild?.premiumSubscriptionCount || "N/A";
        const RamInUseMB = Math.floor(process.memoryUsage().heapUsed / 1024 / 1024);
        const RamTotalGB = Math.floor(os.totalmem() / 1024 / 1024 / 1024);

        const created = interaction.guild?.createdAt.toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }) || "N/A";

        const guildOwner = interaction.guild?.ownerId;
        let owner = "N/A";
        if (guildOwner) owner = (await interaction.client.users.fetch(guildOwner)).tag;

        const promises = [ // @ts-ignore
            interaction.client.cluster?.fetchClientValues("guilds.cache.size"), // @ts-ignore
            interaction.client.cluster?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];

        // @ts-ignore
        const shardCount = interaction.client.cluster.info.TOTAL_SHARDS || 1;
        const isBotVerified = interaction.client.user?.flags?.has("VerifiedBot") || false;

        const [guilds, members] = await Promise.all(promises);
        const totalGuilds = guilds?.reduce((acc, guildCount) => Number(acc) + Number(guildCount), 0);
        const totalMembers = members?.reduce((acc, memberCount) => Number(acc) + Number(memberCount), 0);

        const botAvatar = interaction.client.user?.displayAvatarURL({ extension: "png" })
            || "https://raw.githubusercontent.com/NullDev/Arithmetica-Bot/master/assets/logo.png";

        const embed = {
            title: "Bot Info",
            description: (await __("replies.bot_info_tagline")(interaction.guildId)) + "\n[» Bot Invite «](https://discordapp.com/oauth2/authorize?client_id=1108279646165942363&scope=bot&permissions=1100048526544)",
            color: 2518621,
            thumbnail: {
                url: botAvatar,
            },
            fields: [
                {
                    name: "Author :computer:",
                    value: "`nullping` / [NullDev](https://github.com/NullDev)",
                    inline: true,
                },
                {
                    name: "Source Code :scroll:",
                    value: "[NullDev/Arithmetica-Bot](https://github.com/NullDev/Arithmetica-Bot)",
                    inline: true,
                },
                { name: "\u200b", value: "\u200b", inline: true },
                {
                    name: "Programming Language :wrench:",
                    value: `NodeJS ${process.version}`,
                    inline: true,
                },
                {
                    name: "Server OS :pager:",
                    value: `${os.type()} ${os.release()} ${os.arch()}`,
                    inline: true,
                },
                { name: "\u200b", value: "\u200b", inline: true },
                {
                    name: "Meta :bar_chart:",
                    value: `PID: \`${process.pid}\`\nUptime: \`${
                        process.uptime().toFixed(4)
                    }s\`\nSystem CPU Time: \`${process.cpuUsage().system}\`\nUser CPU Time: \`${process.cpuUsage().system}\`\nRam Usage: \`${RamInUseMB}MB / ${RamTotalGB}GB\`\nShard Count: \`${shardCount}\`\nBot Verified: \`${isBotVerified}\``,
                    inline: true,
                },
                {
                    name: "Guild :clipboard:",
                    value: `User: \`${count}\`\nBoosts: \`${boosts}\`\nCreated: \`${created}\`\nOwner: \`${owner}\`\nGuild Lang: \`${
                        await __("__LANG__")(interaction.guildId)
                    }\`\nServer count: \`${totalGuilds}\`\nMember count: \`${totalMembers}\``,
                    inline: true,
                },
                { name: "\u200b", value: "\u200b", inline: true },
            ],
        };

        return await interaction.reply({ embeds: [embed] });
    },
};
