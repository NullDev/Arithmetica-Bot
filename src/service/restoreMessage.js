import path from "node:path";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Restore a message
 *
 * @param {import("discord.js").Message<boolean> | import("discord.js").PartialMessage} message
 * @return {Promise<void>}
 */
const restoreMessage = async function(message){
    const ch = /** @type {import("discord.js").TextChannel} */ (message.channel);
    if (!ch) return;

    const lastCountString = await db.get(`guild-${message.guildId}.lastCountString`);
    if (!lastCountString || message.content !== lastCountString) return;

    const name = message.author?.username || "Arithmetica";
    const avatar = message.author?.displayAvatarURL() || message.client.user?.displayAvatarURL();

    const webhook = await ch.createWebhook({ name, avatar });
    const webhookMessage = await webhook.send({
        content: lastCountString,
        username: name,
        avatarURL: avatar,
    });

    await webhookMessage.react("✅");
    await webhook.delete();
};

export default restoreMessage;
