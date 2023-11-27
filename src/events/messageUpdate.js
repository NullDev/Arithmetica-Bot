import path from "node:path";
import { QuickDB } from "quick.db";
import restoreMessage from "../service/restoreMessage.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Handle messageUpdate event
 *
 * @param {import("discord.js").Message<boolean> | import("discord.js").PartialMessage} oldMessage
 * @param {import("discord.js").Message<boolean> | import("discord.js").PartialMessage} newMessage
 * @return {Promise<void>}
 */
const messageUpdate = async function(oldMessage, newMessage){
    if (oldMessage.author?.bot) return;

    const configuredGuildChannel = await db.get(`guild-${oldMessage.guildId}.channel`);
    if (!configuredGuildChannel) return;
    if (configuredGuildChannel !== oldMessage.channelId) return;

    const lastCountString = await db.get(`guild-${oldMessage.guildId}.lastCountString`);
    if (!lastCountString || oldMessage.content !== lastCountString || newMessage.content === lastCountString) return;

    await newMessage.delete();
    await restoreMessage(oldMessage);
};

export default messageUpdate;
