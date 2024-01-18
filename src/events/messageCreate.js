import QueueManager from "../service/queueManager.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const queueManager = new QueueManager();

/**
 * Handle messageCreate event
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<void>}
 */
const messageCreate = async function(message){
    if (message.author.bot || message.system || !message.guild) return;

    queueManager.enqueueMessage(message);
};

export default messageCreate;
