import { GatewayIntentBits, Events, ActivityType } from "discord.js";
import Log from "./util/log.js";
import { config } from "../config/config.js";
import DiscordClient from "./service/client.js";
import registerCommands from "./service/commandRegister.js";
import interactionCreateHandler from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";
import messageDelete from "./events/messageDelete.js";
import scheduleCrons from "./service/cronScheduler.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    presence: {
        status: "dnd",
        activities: [{ name: "Starting...", type: ActivityType.Playing }],
    },
});

Log.wait("Starting bot...");

client.on(Events.ClientReady, async() => {
    Log.done("Bot is ready!");

    const guildCount = await client.guilds.fetch().then(guilds => guilds.size);
    Log.info("Logged in as '" + client.user?.tag + "'! Serving in " + guildCount + " servers.");

    await registerCommands(client)
        .then(() => client.on(Events.InteractionCreate, async interaction => interactionCreateHandler(interaction)));

    await scheduleCrons(client);

    client.user?.setActivity({ name: `Counting on ${guildCount} servers!`, type: ActivityType.Playing });

    // Reload guild count every 5 minutes if it changed
    let lastGuildCount = guildCount;
    setInterval(async() => {
        const newGuildCount = await client.guilds.fetch().then(guilds => guilds.size);
        if (newGuildCount !== lastGuildCount){
            lastGuildCount = newGuildCount;
            client.user?.setActivity({ name: `Counting on ${newGuildCount} servers!`, type: ActivityType.Playing });
            Log.info("Guild count changed to " + newGuildCount + ". Updated activity.");
        }
    }, 5 * 60 * 1000);

    client.user?.setStatus("online");
});

client.on(Events.MessageCreate, async message => messageCreate(message));

client.on(Events.MessageDelete, async message => messageDelete(message));

client.on(Events.GuildCreate, guild => Log.info("Joined guild: " + guild.name));

client.on(Events.GuildDelete, guild => Log.info("Left guild: " + guild.name));

client.on(Events.GuildUnavailable, guild => Log.warn("Guild is unavailable: " + guild.name));

client.on(Events.Warn, info => Log.warn(info));

client.on(Events.Error, err => Log.error("Client error.", err));

client.login(config.discord.bot_token)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: ", err));

process.on("unhandledRejection", (
    /** @type {Error} */ err,
) => Log.error("Unhandled promise rejection: ", err));
