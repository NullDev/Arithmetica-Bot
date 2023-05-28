import cron from "node-cron";
import Log from "../util/log.js";
import removeOldLogs from "../crons/removeOldLogs.js";
import deleteRemovedGuilds from "../crons/deleteRemovedGuilds.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Schedule all crons
 *
 * @param {import("../service/client.js").default} client
 */
const scheduleCrons = async function(client){
    // hourly cron
    cron.schedule("0 * * * *", () => {
        deleteRemovedGuilds(client);
    });

    // daily cron
    cron.schedule("0 0 * * *", () => {
        removeOldLogs();
    });

    const cronCount = cron.getTasks().size;
    Log.done("Scheduled " + cronCount + " Crons.");

    // start jobs on init
    await removeOldLogs();
    await deleteRemovedGuilds(client);
};

export default scheduleCrons;
