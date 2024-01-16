import path from "node:path";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const userDb = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

const guildDb = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Iterate over quick DB
 *
 * @param {object} dbObj
 * @param {import("../service/client.js").default} client
 * @return {Promise<Number>}
 */
const iterator = async function(dbObj, dbname, client){
    let counter = 0;
    for (const guild of dbObj){
        const guildId = guild.id.replace("guild-", "");
        const discordGuild = await client.guilds.fetch(guildId).catch(() => null);

        if (!discordGuild){
            Log.warn(`[CRON] Removing guild ${guildId} from DB...`);
            if (dbname === "guild") await guildDb.delete(guild.id);
            if (dbname === "user") await userDb.delete(guild.id);
            ++counter;
            continue;
        }
    }
    return counter;
};

/**
 * Delete guilds from DB that the bot is no longer in
 *
 * @param {import("../service/client.js").default} client
 */
const deleteRemovedGuilds = async(client) => {
    Log.wait("[CRON] Removing non-existant guilds from DB...");

    const removed1 = await iterator(await userDb.all(), "user", client);
    const removed2 = await iterator(await guildDb.all(), "guild", client);

    if (removed1 !== removed2) Log.warn("[CRON] Db Mismatch! Removed " + removed1 + " from user DB and " + removed2 + " from guild DB.");

    Log.done(`[CRON] Cleaned up DB. Removed ${removed1} guilds.`);
};

export default deleteRemovedGuilds;
