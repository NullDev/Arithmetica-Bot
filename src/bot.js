import { GatewayIntentBits, Events, ActivityType, Partials, AuditLogEvent } from "discord.js";
import fastify from "fastify";
import Log from "./util/log.js";
import { config } from "../config/config.js";
import defaults from "./util/defaults.js";
import DiscordClient from "./service/client.js";
import DblHandler from "./service/dblHandler.js";
import registerCommands from "./service/commandRegister.js";
import interactionCreateHandler from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";
import messageDelete from "./events/messageDelete.js";
import messageUpdate from "./events/messageUpdate.js";
import scheduleCrons from "./service/cronScheduler.js";
import voteHandler from "./service/voteHandler.js";

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
});

Log.wait("Starting bot...");

const dblHandler = new DblHandler(client);

client.on(Events.ClientReady, async() => {
    Log.done("Client is ready!");

    const guildCount = await client.guilds.fetch().then(guilds => guilds.size);
    Log.info("Logged in as '" + client.user?.tag + "'! Serving in " + guildCount + " servers.");

    await registerCommands(client)
        .then(() => client.on(Events.InteractionCreate, async interaction => interactionCreateHandler(interaction)));

    await scheduleCrons(client);

    client.user?.setActivity({ name: `Counting on ${guildCount} servers!`, type: ActivityType.Playing });
    dblHandler.postBotStats(guildCount);

    // Reload guild count every 5 minutes if it changed
    let lastGuildCount = guildCount;
    setInterval(async() => {
        const newGuildCount = await client.guilds.fetch().then(guilds => guilds.size);
        const statusHasReset = client.user?.presence.activities[0].name === "Starting...";

        if (newGuildCount !== lastGuildCount || statusHasReset){
            lastGuildCount = newGuildCount;
            client.user?.setActivity({ name: `Counting on ${newGuildCount} servers!`, type: ActivityType.Playing });
            Log.info("Guild count changed to " + newGuildCount + ". Updated activity.");

            if (!statusHasReset) dblHandler.postBotStats(newGuildCount);
            else Log.warn("Shard probably died. Re-Setting status without posting stats.");
        }
    }, 5 * 60 * 1000);

    client.user?.setStatus("online");
});

client.on(Events.MessageCreate, message => messageCreate(message));

client.on(Events.MessageDelete, message => messageDelete(message));

client.on(Events.MessageUpdate, (oldMessage, newMessage) => messageUpdate(oldMessage, newMessage));

client.on(Events.GuildCreate, async guild => {
    Log.info("Joined guild: " + guild.name);

    const logs = await guild.fetchAuditLogs().catch(() => null);
    if (!logs) return;

    const data = logs.entries.filter(e => e.action === AuditLogEvent.BotAdd);
    if (!data) return;

    // @ts-ignore
    const user = data.find(l => l.target?.id === client.user?.id)?.executor;
    if (!user) return;

    const embed = {
        color: defaults.embed_color,
        title: "<:arithmetica:1200390110169022475>┃Quick Bot Setup",
        description: "Hey there!\nThanks for adding me to your server! :smile_cat:\nSet the counting channel with `/set-channel` and you are all done!\nPlease view `/admin-help` on your server, to see all the other options you can configure, such as language, timeouts, etc.\n\nHappy counting! <:blushu:968831290981904414>",
        footer: {
            text: `For ${user.displayName ?? user.tag}`,
            icon_url: user.displayAvatarURL(),
        },
    };

    user.send({ embeds: [embed] }).catch(() => Log.warn("Failed to send welcome message to user: " + user.tag));
});

client.on(Events.GuildDelete, guild => Log.info("Left guild: " + guild.name));

client.on(Events.GuildUnavailable, guild => Log.warn("Guild is unavailable: " + guild.name));

client.on(Events.Warn, info => Log.warn(info));

client.on(Events.Error, err => Log.error("Client error.", err));

client.login(config.discord.bot_token)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: ", err));

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

process.on("unhandledRejection", (
    /** @type {Error} */ err,
) => Log.error("Unhandled promise rejection: ", err));
