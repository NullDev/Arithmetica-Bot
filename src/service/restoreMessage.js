import path from "node:path";
import { QuickDB } from "quick.db";
import mathEval from "../util/mathEval.js";

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
 * @param {import("discord.js").Message<boolean> | import("discord.js").PartialMessage | null} [newMessage=null]
 * @return {Promise<void>}
 */
const restoreMessage = async function(message, newMessage = null){
    const ch = /** @type {import("discord.js").TextChannel} */ (message.channel);
    if (!ch) return;

    const lastCountString = await db.get(`guild-${message.guildId}.lastCountString`) ?? "0";
    if (!lastCountString || (message.content !== lastCountString && mathEval(message.content || "") !== lastCountString)) return;
    if (!!newMessage){
        if (newMessage.content === lastCountString || mathEval(newMessage.content || "") === lastCountString) return;
        newMessage.delete();
    }

    const arithmetic = await db.get(`guild-${message.guildId}.arithmetic`) ?? true;

    const name = message.author?.username || "Arithmetica";
    const avatar = message.author?.displayAvatarURL() || message.client.user?.displayAvatarURL();

    const webhook = await ch.createWebhook({ name, avatar });
    const webhookMessage = await webhook.send({
        content: !!arithmetic
            ? message.content
            : lastCountString,
        username: name,
        avatarURL: avatar,
    });

    await webhookMessage.react("✅");
    await webhook.delete();
};

export default restoreMessage;
