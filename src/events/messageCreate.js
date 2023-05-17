import countingService from "../service/countingService.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle messageCreate event
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<void>}
 */
const messageCreate = async function(message){
    if (message.author.bot) return;
    await countingService(message);
};

export default messageCreate;
