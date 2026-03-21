import path from "node:path";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const guildDb = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Handle messageReactionAdd event
 *
 * @param {import("discord.js").MessageReaction | import("discord.js").PartialMessageReaction} reaction
 * @param {import("discord.js").User | import("discord.js").PartialUser} user
 * @return {Promise<void>}
 */
const messageReactionAdd = async function(reaction, user){
    if (user.bot) return;

    if (reaction.partial){
        try {
            await reaction.fetch();
        }
        catch (error){
            const err = error instanceof Error ? error : new Error(String(error));
            Log.error("Error fetching reaction: ", err);
            return;
        }
    }

    if (reaction.emoji.id === "1485010143799152701"){
        const texKey = `guild-${reaction.message.guildId}.tex-${reaction.message.id}`;
        const texOwner = await guildDb.get(texKey);

        if (!texOwner) return;

        if (user.id !== texOwner){
            await reaction.users.remove(user.id);
            return;
        }

        await guildDb.delete(texKey);
        await reaction.message.delete();
        return;
    }
};

export default messageReactionAdd;
