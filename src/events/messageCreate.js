import QueueManager from "../service/queueManager.js";
import devCmd from "../service/devCmd.js";

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
    if (message.author.bot || message.system) return;

    if (!message.guild){
        await devCmd(message);
        return;
    }

    if (message.partial) return;

    queueManager.enqueueMessage(message);
};

export default messageCreate;
