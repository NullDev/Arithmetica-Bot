import countingService from "../service/countingService.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const QUEUES = {};

/**
 * @param {string} guildId
 * @return {unknown[]}
 */
const getOrCreateQueue = function(guildId){
    if (!QUEUES[guildId]) QUEUES[guildId] = [];
    return QUEUES[guildId];
};
/**
 * Work through the queue
 * @param {unknown[]} queue
 */
const handleQueue = async function(queue){
    while (queue.length > 0){
        const message = QUEUE[0];
        await countingService(message);
        queue.shift();
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
    if (!message.guildId) return;

    const queue = getOrCreateQueue(message.guildId);

    queue.push(message);

    if (queue.length === 1) await handleQueue(queue);
};

export default messageCreate;
