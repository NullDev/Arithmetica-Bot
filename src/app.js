import { ShardingManager } from "discord.js";
import Log from "./util/log.js";
import { config, meta } from "../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const manager = new ShardingManager("./src/bot.js", {
    token: config.discord.bot_token,
});

const appname = meta.getName();
const version = meta.getVersion();
const author = meta.getAuthor();
const pad = 16 + appname.length + version.toString().length + author.length;

console.log(
    "\n" +
    " #" + "-".repeat(pad) + "#\n" +
    " # Started " + appname + " v" + version + " by " + author + " #\n" +
    " #" + "-".repeat(pad) + "#\n",
);

Log.debug("Node Environment: " + process.env.NODE_ENV, true);
Log.debug("NodeJS version: " + process.version, true);
Log.debug("OS: " + process.platform + " " + process.arch, true);

manager.on("shardCreate", shard => Log.info(`Launched shard ${shard.id}`));

manager.spawn();
