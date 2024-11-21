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
 * Remove the loser role from users where the timestamp has expired
 *
 * @param {import("../service/client.js").default} client
 */
const removeLoserRoles = async(client) => {
    Log.wait("[CRON] Removing loser roles...");

    const expiredUsers = (await userDb.all())
        .filter(data => data.id.startsWith("guild-"))
        .map(data => data.value)
        .flatMap(guildData => Object.keys(guildData).filter(user => guildData[user]["loser-role-time"] <= Date.now()));

    for (const user of expiredUsers){
        const guildId = user.split("-")[1];
        const userId = user.split("-")[3];

        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(userId);

        const loserRoleID = await guildDb.get(`guild-${guildId}.loserRole`);
        const loserRole = guild.roles.cache.get(loserRoleID);
        if (loserRole) await member.roles.remove(loserRole);

        await userDb.delete(`guild-${guildId}.user-${userId}.loser-role`);
        await userDb.delete(`guild-${guildId}.user-${userId}.loser-role-time`);
    }

    Log.done("[CRON] Removed loser roles.");
};

export default removeLoserRoles;
