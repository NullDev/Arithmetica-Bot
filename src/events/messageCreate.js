import countingService from "../service/countingService.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const QUEUE = [];

const handleQueue = async function(){
    if (QUEUE.length > 0){
        const message = QUEUE.shift();
        await countingService(message);
        await handleQueue();
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
