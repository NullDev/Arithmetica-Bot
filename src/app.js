import fs from "node:fs";
import path from "node:path";
import EventEmitter from "node:events";
import { ClusterManager } from "discord-hybrid-sharding";
import Log from "./util/log.js";
import { config, meta } from "../config/config.js";
import translationCheck from "./util/translationCheck.js";


// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

EventEmitter.defaultMaxListeners = 20;

const manager = new ClusterManager("./src/bot.js", {
    totalShards: config.discord.total_shards,
    shardsPerClusters: 1,
    token: config.discord.bot_token,
});

const appname = meta.getName();
const version = meta.getVersion();
const author = meta.getAuthor();
const pad = 16 + appname.length + version.toString().length + author.length;

Log.raw(
    "\n" +
    " #" + "-".repeat(pad) + "#\n" +
    " # Started " + appname + " v" + version + " by " + author + " #\n" +
    " #" + "-".repeat(pad) + "#\n",
);

Log.info("--- START ---");
Log.info(appname + " v" + version + " by " + author);

Log.debug("Node Environment: " + process.env.NODE_ENV, true);
Log.debug("NodeJS version: " + process.version, true);
Log.debug("OS: " + process.platform + " " + process.arch, true);

Log.wait("Ensuring data dir...");
if (!fs.existsSync(path.resolve("./data"))){
    const dataDir = path.resolve("./data");
    fs.mkdirSync(dataDir);
    fs.closeSync(fs.openSync(path.resolve(dataDir, ".gitkeep"), "w"));
    Log.done("Created missing data dir!");
}
else Log.done("Data dir exists!");

Log.wait("Checking locales...");
if (await translationCheck()) Log.done("Locales are in sync!");
else {
    Log.error("Locales are not in sync!");
    process.exit(1);
}

manager.on("clusterCreate", shard => Log.info(`Launched shard ${shard.id}`));

manager.spawn({ timeout: -1 });
