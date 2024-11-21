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

    const users = (await userDb.all());
    const result = [];
    let removedRoles = 0;

    for (const guild of users){
        const guildId = guild.id;
        const userValues = guild.value;
        for (const [userId, userData] of Object.entries(userValues)){
            if (userData["loser-role-time"]){
                result.push({
                    guildId: guildId.replace("guild-", ""),
                    userId: userId.replace("user-", ""),
                    loserRoleTime: userData["loser-role-time"],
                });
            }
        }
    }

    for (const { guildId, userId, loserRoleTime } of result){
        if (loserRoleTime <= Date.now()){
            const guild = await client.guilds.fetch(guildId);
            const member = await guild.members.fetch(userId);
            const loserRole = await guildDb.get(`guild-${guildId}.loserRole`);
            if (loserRole){
                await member.roles.remove(loserRole);
                await userDb.delete(`guild-${guildId}.user-${userId}.loser-role-time`);
                ++removedRoles;
            }
        }
    }

    Log.done(`[CRON] Removed ${removedRoles} loser roles.`);
};

export default removeLoserRoles;
