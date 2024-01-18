import countingService from "../service/countingService.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const QUEUE = [];

/**
 * Work through the queue
 */
const handleQueue = async function(){
    while (QUEUE.length > 0){
        const message = QUEUE[0];
        await countingService(message);
        QUEUE.shift();
    }
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

    if (QUEUE.length === 1) await handleQueue();
};

export default messageCreate;
