import countingService from "../service/countingService.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const QUEUE = [];

const handleQueue = async function(){
    if (QUEUE.length > 0){
        const message = QUEUE.shift();
        await countingService(message);
        handleQueue();
    }
    else Log.info("Cleared queue.");
    console.log(QUEUE);
};

/**
 * Handle messageCreate event
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<void>}
 */
const messageCreate = async function(message){
    if (message.author.bot) return;

    QUEUE.push(message);

    if (QUEUE.length === 1){
        Log.info("Started queue.");
        handleQueue();
    }
};

export default messageCreate;
