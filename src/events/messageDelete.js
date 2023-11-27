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
 * Handle messageDelete event
 *
 * @param {import("discord.js").PartialMessage | import("discord.js").Message<boolean>} message
 * @return {Promise<void>}
 */
const messageDelete = async function(message){
    const configuredGuildChannel = await db.get(`guild-${message.guildId}.channel`);
    if (!configuredGuildChannel) return;
    if (configuredGuildChannel !== message.channelId) return;

    const reactions = message.reactions.cache;
    if (!reactions) return;

    const reaction = reactions.get("✅");
    if (!reaction) return;

    const reactionAuthor = reaction.users.cache.first();
    if (!reactionAuthor || reactionAuthor.id !== message.client.user?.id) return;

    await restoreMessage(message);
};

export default messageDelete;
