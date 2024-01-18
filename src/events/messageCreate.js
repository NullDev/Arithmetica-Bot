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
    queueManager.enqueueMessage(message);
};

export default messageCreate;
