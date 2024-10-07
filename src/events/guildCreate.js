import { AuditLogEvent } from "discord.js";
import defaults from "../util/defaults.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Send welcome message to user who added the bot to the server
 *
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").Client} client
 * @return {Promise<void>}
 */
const guildCreate = async function(guild, client){
    Log.info("Joined guild: " + guild.name);

    const logs = await guild.fetchAuditLogs().catch(() => null);
    if (!logs) return;

    const data = logs.entries.filter(e => e.action === AuditLogEvent.BotAdd);
    if (!data) return;

    // @ts-ignore
    const user = data.find(l => l.target?.id === client.user?.id)?.executor;
    if (!user) return;

    const embed = {
        color: defaults.embed_color,
        title: "<:arithmetica:1200390110169022475>┃Quick Bot Setup",
        description: "Hey there!\nThanks for adding me to your server! :smile_cat:\nSet the counting channel with `/set-channel` and you are all done!\nPlease view `/admin-help` on your server, to see all the other options you can configure, such as language, timeouts, etc.\n\nHappy counting! <:blushu:968831290981904414>",
        footer: {
            text: `For ${user.displayName ?? user.tag}`,
            icon_url: user.displayAvatarURL(),
        },
    };

    user.send({ embeds: [embed] }).catch(() => Log.warn("Failed to send welcome message to user: " + user.tag));
};

export default guildCreate;
