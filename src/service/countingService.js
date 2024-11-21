import path from "node:path";
import { QuickDB } from "quick.db";
import mathEval from "../util/mathEval.js";
import defaults from "../util/defaults.js";
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
    let timeoutMinutes = Number(await guildDb.get(`guild-${message.guildId}.timeout`)) || defaults.timeout_minutes;
    if (!timeoutMinutes) return 0;

    const guildUser = await message.guild?.members.fetch(message.author.id);
    if (!guildUser) return 0;

    const lastUserTimeout = await userDb.get(`guild-${message.guildId}.user-${message.author.id}.last-timeout`);
    const lastUserTimeoutTime = await userDb.get(`guild-${message.guildId}.user-${message.author.id}.last-timeout-time`) || 0;
    const timeoutFactor = Number(await guildDb.get(`guild-${message.guildId}.timeout-factor`)) || defaults.timeout_factor;

    if (!lastUserTimeout && timeoutFactor > 1){
        await userDb.set(`guild-${message.guildId}.user-${message.author.id}.last-timeout`, timeoutMinutes);
        await userDb.set(`guild-${message.guildId}.user-${message.author.id}.last-timeout-time`, Date.now());
    }

    // if its been a week since the last timeout, reset the timeout factor
    else if (!!lastUserTimeoutTime && Date.now() - lastUserTimeoutTime > 7 * 24 * 60 * 60 * 1000){
        await userDb.delete(`guild-${message.guildId}.user-${message.author.id}.last-timeout`);
        await userDb.delete(`guild-${message.guildId}.user-${message.author.id}.last-timeout-time`);
    }

    else if (timeoutFactor > 1){
        timeoutMinutes = Math.floor(lastUserTimeout * timeoutFactor);
        await userDb.set(`guild-${message.guildId}.user-${message.author.id}.last-timeout`, timeoutMinutes);
        await userDb.set(`guild-${message.guildId}.user-${message.author.id}.last-timeout-time`, Date.now());
    }

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

    return timeoutMinutes;
};

/**
 * Handle the loser role
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<{ role: string, duration: number} | null>}
 */
const handleloserRole = async function(message){
    const loserRole = await guildDb.get(`guild-${message.guildId}.loserRole`);
    const duration = await guildDb.get(`guild-${message.guildId}.loserRoleDuration`);

    if (!loserRole || !duration) return null;

    const guildUser = await message.guild?.members.fetch(message.author.id);
    if (!guildUser) return null;

    const role = await message.guild?.roles.fetch(loserRole);
    if (!role) return null;

    try {
        await guildUser.roles.add(role);
        await userDb.set(`guild-${message.guildId}.user-${message.author.id}.loser-role-time`, Date.now() + duration * 60 * 1000);
    }
    catch (e){
        Log.error("Failed to add loser role: ", e);
        return null;
    }

    return { role: role.name, duration };
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
    const cheatModeOn = await guildDb.get(`guild-${message.guildId}.cheatmode`) ?? defaults.cheatmode;

    if (cheatModeOn){
        setTimeout(() => message.delete().catch(() => null), 5000);
        return null;
    }

    message.react("❌").catch(() => null);
    let response = await __("replies.incorrect_number", lastNumber, lastNumber + 1, result)(message.guildId);

    const timeout = await handleTimeout(message);
    if (!!timeout) response += "\n" + (await __("replies.timeout", timeout)(message.guildId));

    const loserRole = await handleloserRole(message);
    if (!!loserRole) response += "\n" + (await __("replies.add_loser_role", loserRole.role, loserRole.duration)(message.guildId));

    const best = await guildDb.get(`guild-${message.guildId}.best`) || 0;
    if (best > 0){
        const res = await __("replies.new_best")(message.guildId);
        response += "\n" + await __("replies.failed_stats", lastNumber, best)(message.guildId)
        + " " + (lastNumber === best ? res + " 😄" : "🙁");
        if (lastNumber === best){
            const lastCorrectMessage = await guildDb.get(`guild-${message.guildId}.last-correct-message`);
            if (lastCorrectMessage){
                await message.channel.messages.fetch(lastCorrectMessage).then(msg => msg.react("👑").catch(e => Log.error("Failed to react to message: ", e)));

                const oldMsgId = await guildDb.get(`guild-${message.guildId}.highscore-msg-id`);
                if (oldMsgId){
                    await message.channel.messages.fetch(oldMsgId)
                        .then(msg => msg.unpin().catch(e => Log.error("Failed to unpin message: ", e)))
                        .catch(() => Log.warn("No old pinned message"));
                }

                const pinEnabled = await guildDb.get(`guild-${message.guildId}.pin-highscore`) ?? defaults.pin_highscore;
                if (pinEnabled){
                    const tMsg = await message.channel.messages.fetch(lastCorrectMessage);
                    tMsg.pin().catch(e => Log.error("Failed to pin message: ", e));

                    await guildDb.set(`guild-${message.guildId}.highscore-msg-id`, tMsg.id);
                }
            }
        }
    }

    await message.reply(`<@${message.author.id}> ${response}`).catch(() => {
        Log.warn("Failed to reply to message: " + message.id);
        message.channel.send(`<@${message.author.id}> ${response}`);
    });

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
 * @param {Boolean} [hasRounded=false]
 * @return {Promise<any>}
 */
const correct = async function(message, guild, result, lastCountString, hasRounded = false){
    const previousBest = await guildDb.get(`guild-${guild}.best`) || 0;

    message.react("✅").catch(() => null);
    if (hasRounded) message.react("<:rounded:1215229988597534730>").catch(() => null);

    await guildDb.set(`guild-${guild}.last-correct-message`, message.id);
    await guildDb.set(`guild-${guild}.count`, result);
    await guildDb.set(`guild-${guild}.lastCountString`, lastCountString);
    await userDb.add(`guild-${message.guildId}.user-${message.author.id}.counting-wins`, 1);

    if (result > previousBest) await guildDb.set(`guild-${guild}.best`, result);

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
            msg.delete().catch(() => null);
            message.delete().catch(() => null);
        }, timeout);
    }).catch(() => null);
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

    const isUserBanned = await userDb.get(`guild-${guild}.user-${message.author.id}.banned`);
    if (isUserBanned){
        message.delete();
        return message.author.send(await __("replies.user_banned", message.guild?.name)(message.guildId)).catch(async() => {
            Log.warn("Failed to send DM to user: " + message.author.id);
            return await replyWaitAndDelete(
                message,
                await __("replies.user_banned", message.guild?.name)(message.guildId),
            );
        });
    }

    const newMemberCooldown = await guildDb.get(`guild-${guild}.new-member-cooldown`) || defaults.new_member_cooldown;
    if (newMemberCooldown > 0){
        const memberSince = message.member?.joinedTimestamp;
        if (memberSince){
            const cooldownUntil = memberSince + newMemberCooldown * 60 * 1000;
            if (cooldownUntil > Date.now()){
                const remaining = Math.ceil((cooldownUntil - Date.now()) / (60 * 1000));
                return await replyWaitAndDelete(
                    message,
                    await __("replies.cooldown", remaining)(message.guildId),
                );
            }
        }
    }

    const lastUser = await guildDb.get(`guild-${guild}.lastUser`);
    if (lastUser === message.author.id){
        return await replyWaitAndDelete(
            message,
            await __("errors.same_user")(message.guildId),
        );
    }

    const arithmetic = await guildDb.get(`guild-${guild}.arithmetic`) ?? defaults.arithmetic;
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

    const mathOnlyMode = await guildDb.get(`guild-${guild}.mathonly`) ?? defaults.mathonly;
    if (mathOnlyMode && message.content === String(lastNumber + 1)){
        return await replyWaitAndDelete(
            message,
            await __("errors.math_only")(message.guildId),
        );
    }

    const rounding = await guildDb.get(`guild-${guild}.rounding`) ?? defaults.rounding; // @ts-ignore
    const { result: oResult, error } = mathEval(message.content.replaceAll("\n", " ") ?? 0);
    const result = rounding
        ? Math.round(oResult || 0)
        : oResult || 0;

    const hasRounded = (rounding && (result !== oResult));

    if (!result || isNaN(result)){
        return await replyWaitAndDelete(
            message,
            (await __("errors.invalid_arithmetic")(message.guildId)) + "\n" + (!!error ? error : ""),
        );
    }

    if (Number(lastNumber) + 1 !== Number(result)){
        return await failed(message, lastNumber, result);
    }

    if (Number(lastNumber) + 1 !== Number(message.content)){
        await userDb.add(`guild-${message.guildId}.user-${message.author.id}.counting-math`, 1);
    }

    return await correct(message, guild, result, message.content, hasRounded);
};

export default countingService;
