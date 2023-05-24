import path from "node:path";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Handle messageDelete event
 *
 * @param {import("discord.js").PartialMessage | import("discord.js").Message<boolean>} message
 * @return {Promise<void>}
 */
const messageDelete = async function(message){
    const configuredGuildChannel = await db.get(`guild-${message.guildId}.channel`);
    if (!configuredGuildChannel) return;
    if (configuredGuildChannel !== message.channelId) return;

    const ch = message.channel;
    if (!ch) return;

    const lastCountString = await db.get(`guild-${message.guildId}.lastCountString`);
    if (!lastCountString || message.content !== lastCountString) return;

    const newMessgae = await ch.send(lastCountString);
    await newMessgae.react("✅");
};

export default messageDelete;
