import cron from "node-cron";
import Log from "../util/log.js";
import LogHandler from "../crons/removeOldLogs.js";
import deleteRemovedGuilds from "../crons/deleteRemovedGuilds.js";
import removeLoserRoles from "../crons/removeLoserRoles.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Schedule all crons
 *
 * @param {import("../service/client.js").default} client
 */
const scheduleCrons = async function(client){
    // daily cron
    cron.schedule("0 0 * * *", async() => {
        await deleteRemovedGuilds(client);
        await LogHandler.removeOldLogs();
    });

    // hourly cron
    cron.schedule("0 * * * *", async() => {
        await removeLoserRoles(client);
    });

    const cronCount = cron.getTasks().size;
    Log.done("Scheduled " + cronCount + " Crons.");

    // start jobs on init
    await LogHandler.removeOldLogs();
    await deleteRemovedGuilds(client);
    await removeLoserRoles(client);
};

export default scheduleCrons;
