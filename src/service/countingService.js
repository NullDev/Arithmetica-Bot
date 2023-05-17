import path from "node:path";
import { QuickDB } from "quick.db";
import { evaluate } from "mathjs";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Let the user know they failed
 *
 * @param {import("discord.js").Message} message
 * @param {Number} lastNumber
 * @param {Number} result
 * @return {Promise<any>}
 */
const failed = async function(message, lastNumber, result){
    message.reply(await __("replies.incorrect_number", lastNumber, lastNumber + 1, result)(message.guildId));
    message.react("❌");
    await db.delete(`guild-${message.guildId}.lastUser`);
    return await db.set(`guild-${message.guildId}.count`, 0);
};

/**
 * Let the user know they succeeded
 *
 * @param {import("discord.js").Message} message
 * @param {String} guild
 * @param {Number} result
 * @return {Promise<any>}
 */
const correct = async function(message, guild, result){
    await message.react("✅");
    await db.set(`guild-${guild}.count`, result);
    return await db.set(`guild-${guild}.lastUser`, message.author.id);
};

/**
 * Reply to a message and delete it after a timeout
 *
 * @param {import("discord.js").Message} message
 * @param {String} content
 * @param {Number} [timeout=20000] (8sec)
 * @return {Promise<any>}
 */
const replyWaitAndDelete = async function(message, content, timeout = 8000){
    return message.reply(content).then((msg) => {
        setTimeout(() => {
            msg.delete();
            message.delete();
        }, timeout);
    });
};

/**
 * Handle counting
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<any>}
 */
const countingService = async function(message){
    const guild = message.guildId;
    if (!guild) return null;

    const channel = message.channel.id;

    const channelID = await db.get(`guild-${guild}.channel`);
    if (!channelID || channelID !== channel) return null;

    const lastUser = await db.get(`guild-${guild}.lastUser`);
    if (lastUser === message.author.id){
        return await replyWaitAndDelete(
            message,
            await __("errors.same_user")(message.guildId),
        );
    }

    const arithmetic = await db.get(`guild-${guild}.arithmetic`) ?? true;
    const lastNumber = await db.get(`guild-${guild}.count`) || 0;

    if (!arithmetic){
        if (isNaN(Number(message.content))){
            return await replyWaitAndDelete(
                message,
                await __("errors.not_a_number")(message.guildId),
            );
        }

        if (lastNumber + 1 !== Number(message.content)){
            return await failed(message, lastNumber, Number(message.content));
        }

        return await correct(message, guild, Number(message.content));
    }

    let result;
    try { result = evaluate(message.content); }
    catch (e){ result = null; }

    if (!result || isNaN(result)){
        return await replyWaitAndDelete(
            message,
            await __("errors.invalid_arithmetic")(message.guildId),
        );
    }

    if (lastNumber + 1 !== result){
        return await failed(message, lastNumber, result);
    }

    return await correct(message, guild, result);
};

export default countingService;
