import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { GatewayIntentBits, Events, ActivityType, Partials } from "discord.js";
import Log from "./util/log.js";
import { config } from "../config/config.js";
import DiscordClient from "./service/client.js";
import messageCreate from "./events/messageCreate.js";
import messageDelete from "./events/messageDelete.js";
import messageUpdate from "./events/messageUpdate.js";
import clientReady from "./events/clientReady.js";
import guildCreate from "./events/guildCreate.js";
import shardReady from "./events/shardReady.js";
import fastifyHandler from "./service/fastifyHandler.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
    presence: {
        status: "dnd",
        activities: [{ name: "Starting...", type: ActivityType.Playing }],
    },
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS,
});

Log.wait("Starting bot...");

client.cluster = new ClusterClient(client);

client.on(Events.ClientReady, async() => clientReady(client));

client.on(Events.ShardReady, async shard => shardReady(client, shard));

client.on(Events.MessageCreate, message => messageCreate(message));

client.on(Events.MessageDelete, message => messageDelete(message));

client.on(Events.MessageUpdate, (oldMessage, newMessage) => messageUpdate(oldMessage, newMessage));

client.on(Events.GuildCreate, async guild => guildCreate(guild, client));

client.on(Events.GuildDelete, guild => Log.info("Left guild: " + guild.name));

client.on(Events.GuildUnavailable, guild => Log.warn("Guild is unavailable: " + guild.name));

client.on(Events.Warn, info => Log.warn(info));

client.on(Events.Error, err => Log.error("Client error.", err));

client.login(config.discord.bot_token)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: ", err));

fastifyHandler(client);

process.on("unhandledRejection", (
    /** @type {Error} */ err,
) => Log.error("Unhandled promise rejection: ", err));
