import Log from "../util/log.js";
import { config } from "../../config/config.js";
import getRandomMathFact from "../util/mathFact.js";

/**
 * @typedef {import("fastify").FastifyRequest} Request
 *
 * @param {import("discord.js").Client} client
 * @param {String} user
 */
const registerVote = async function(client, user){
    Log.done("Received vote from user " + user + "!");

    const dmChannel = await client.users.fetch(user).catch(() => Log.warn("Could not fetch user " + user + "!"));
    if (dmChannel){
        await dmChannel.send(
            "Thank you for your vote! :) :heart:\n\n" +
            "Have a random math fact:\n" +
            getRandomMathFact(),
        ).catch(() => Log.warn("Could not send vote message to user " + user + "!"));
    }
};

/**
 * Handle vote from top.gg and discordbotlist.com
 *
 * @param {import("fastify").FastifyRequest} req
 * @param {import("fastify").FastifyReply} res
 * @param {import("discord.js").Client} client
 *
 * @return {Promise<*>}
 */
const voteHandler = async function(req, res, client){
    if (req.headers.authorization !== config.discord.dbl_token) return res.code(401).send({ error: "Unauthorized" });
    if (!req.body) return res.code(400).send({ error: "Missing body" });

    const { user, bot, id } = /** @type {Object} */ (req.body);
    if (!user && !id) return res.code(400).send({ error: "Missing user" });

    if (!!bot && bot !== client.user?.id){
        Log.warn("Received vote for unknown bot: " + bot);
        return res.code(400).send({ error: "Unknown bot" });
    }

    await registerVote(client, user || id);

    return res.code(200).send({ message: "OK" });
};

export default voteHandler;
