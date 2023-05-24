import path from "node:path";
import { QuickDB } from "quick.db";
import { evaluate } from "mathjs";
import Log from "../util/log.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const userDb = new QuickDB({
    filePath: path.resolve("./data/user_data.sqlite"),
});

const guildDb = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * Handle a potential timeout and return whether the user was timed out
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<Number>}
 */
const handleTimeout = async function(message){
    const timeoutMinutes = Number(await guildDb.get(`guild-${message.guildId}.timeout`));
    if (!timeoutMinutes) return 0;
    const guildUser = await message.guild?.members.fetch(message.author.id);
    if (guildUser){
        try {
            await guildUser.timeout(
                timeoutMinutes * 60 * 1000,
                "User lost the counting game",
            );
        }
        catch (e){
            Log.error("Failed to timeout user: ", e);
            return 0;
        }
    }
    return timeoutMinutes;
};

/**
 * Let the user know they failed
 *
 * @param {import("discord.js").Message} message
 * @param {Number} lastNumber
 * @param {Number} result
 * @return {Promise<any>}
 */
const failed = async function(message, lastNumber, result){
    await message.react("❌");
    let response = await __("replies.incorrect_number", lastNumber, lastNumber + 1, result)(message.guildId);

    const timeout = await handleTimeout(message);
    if (!!timeout) response += "\n" + (await __("replies.timeout", timeout)(message.guildId));

    await message.reply(response);

    await guildDb.delete(`guild-${message.guildId}.lastUser`);
    await userDb.add(`guild-${message.guildId}.user-${message.author.id}.counting-fails`, 1);
    return await guildDb.set(`guild-${message.guildId}.count`, 0);
};

/**
 * Let the user know they succeeded
 *
 * @param {import("discord.js").Message} message
 * @param {String} guild
 * @param {Number} result
 * @param {String} lastCountString
 * @return {Promise<any>}
 */
const correct = async function(message, guild, result, lastCountString){
    await message.react("✅");
    await guildDb.set(`guild-${guild}.count`, result);
    await guildDb.set(`guild-${guild}.lastCountString`, lastCountString);
    await userDb.add(`guild-${message.guildId}.user-${message.author.id}.counting-wins`, 1);
    return await guildDb.set(`guild-${guild}.lastUser`, message.author.id);
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
    return await message.reply(content).then((msg) => {
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

    const channelID = await guildDb.get(`guild-${guild}.channel`);
    if (!channelID || channelID !== channel) return null;

    const lastUser = await guildDb.get(`guild-${guild}.lastUser`);
    if (lastUser === message.author.id){
        return await replyWaitAndDelete(
            message,
            await __("errors.same_user")(message.guildId),
        );
    }

    const arithmetic = await guildDb.get(`guild-${guild}.arithmetic`) ?? true;
    const lastNumber = await guildDb.get(`guild-${guild}.count`) || 0;

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

        return await correct(message, guild, Number(message.content), message.content);
    }

    let result;
    try { result = evaluate(message.content); }
    catch (e){ result = null; }

    if (result && typeof result === "object" && result.entries){
        result = result.entries[0];
    }

    if (!result || isNaN(result)){
        return await replyWaitAndDelete(
            message,
            await __("errors.invalid_arithmetic")(message.guildId),
        );
    }

    if (lastNumber + 1 !== result){
        return await failed(message, lastNumber, result);
    }

    return await correct(message, guild, result, message.content);
};

export default countingService;
