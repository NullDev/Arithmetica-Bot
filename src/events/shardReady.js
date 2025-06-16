import setStatus from "../util/setStatus.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle shard ready event
 *
 * @param {import("../service/client.js").default} client
 * @param {number} shard
 * @return {Promise<void>}
 */
const shardReady = async function(client, shard){
    Log.info(`Shard ${shard} is ready!`);
    const guilds = await client.cluster?.fetchClientValues("guilds.cache.size");
    const guildCount = guilds?.reduce((acc, gc) => Number(acc) + Number(gc), 0);
    await setStatus(client, guildCount);

    // Reload guild count every 10 minutes if it changed
    let lastGuildCount = guildCount;
    setInterval(async() => {
        const newGuilds = await client.cluster?.fetchClientValues("guilds.cache.size");
        const newGuildCount = newGuilds?.reduce((acc, gc) => Number(acc) + Number(gc), 0);

        if (newGuildCount !== lastGuildCount){
            lastGuildCount = newGuildCount;
            await setStatus(client, newGuildCount);
            Log.info(`Guild count changed from ${guildCount} to ${newGuildCount} (${(newGuildCount - guildCount) > 0 ? "+" : ""}${(newGuildCount - guildCount)}). Updated activity.`);
        }
    }, 10 * 60 * 1000);
};

export default shardReady;
