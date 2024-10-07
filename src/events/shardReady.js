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
    const guildCount = await client.guilds.fetch().then(guilds => guilds.size);
    await setStatus(client, guildCount);

    // Reload guild count every 10 minutes if it changed
    let lastGuildCount = guildCount;
    setInterval(async() => {
        const newGuildCount = await client.guilds.fetch().then(guilds => guilds.size);

        if (newGuildCount !== lastGuildCount){
            lastGuildCount = newGuildCount;
            await setStatus(client, newGuildCount);
            Log.info("Guild count changed to " + newGuildCount + ". Updated activity.");
        }
    }, 10 * 60 * 1000);
};

export default shardReady;
