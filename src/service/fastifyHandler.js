import fastify from "fastify";
import voteHandler from "./voteHandler.js";
import { config } from "../../config/config.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Register Fastify Server for production
 *
 * @param {import("discord.js").Client} client
 */
const fastifyHandler = function(client){
    if (process.env.NODE_ENV === "production"){
        Log.wait("Starting Fastify Server...");

        const server = fastify({ logger: false });
        server.post("/vote", (req, res) => voteHandler(req, res, client));
        server.get("/vote", (_, res) => res.code(405).send({ error: "Method not allowed" }));
        server.listen({
            port: config.http.port,
        }, (err, address) => {
            if (err) Log.error("Failed to start Fastify Server: ", err);
            Log.done(`Fastify Server listening on ${address}`);
        });
    }
    else Log.info("Not starting Fastify Server since we are not in production mode.");
};

export default fastifyHandler;
