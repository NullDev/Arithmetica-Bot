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
import fastifyHandler from "./service/fastifyHandler.js";
import setStatus from "./util/setStatus.js";

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

client.on(Events.ShardReady, async shard => {
    Log.info(`Shard ${shard} is ready!`);
    const guildCount = await client.guilds.fetch().then(guilds => guilds.size);
    await setStatus(client, guildCount);

    // Reload guild count every 10 minutes if it changed
    let lastGuildCount = guildCount;
    setInterval(async() => {
        const newGuildCount = await client.guilds.fetch().then(guilds => guilds.size);

        if (newGuildCount !== lastGuildCount){
            lastGuildCount = newGuildCount;
            await setStatus(client, newGuildCount);
            Log.info("Guild count changed to " + newGuildCount + ". Updated activity.");
        }
    }, 10 * 60 * 1000);
});

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
