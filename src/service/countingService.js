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
    return db.set(`guild-${message.guildId}.count`, 0);
};

/**
 * Handle counting
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<any>}
 */
const countingService = async function(message){
    const guild = message.guildId;
    const channel = message.channel.id;

    const channelID = await db.get(`guild-${guild}.channel`);
    if (!channelID || channelID !== channel) return null;

    const arithmetic = await db.get(`guild-${guild}.arithmetic`);
    const lastNumber = await db.get(`guild-${guild}.count`) || 0;

    if (!arithmetic){
        if (isNaN(Number(message.content))){
            return message.reply(
                await __("errors.not_a_number")(message.guildId),
            );
        }

        if (lastNumber + 1 !== Number(message.content)){
            return await failed(message, lastNumber, Number(message.content));
        }

        await db.set(`guild-${guild}.count`, Number(message.content));
        return await message.react("✅");
    }

    let result;
    try { result = evaluate(message.content); }
    catch (e){ result = null; }

    if (!result || isNaN(result)){
        return message.reply(
            await __("errors.invalid_arithmetic")(message.guildId),
        );
    }

    if (lastNumber + 1 !== result){
        return await failed(message, lastNumber, result);
    }

    await db.set(`guild-${guild}.count`, result);
    return await message.react("✅");
};

export default countingService;
