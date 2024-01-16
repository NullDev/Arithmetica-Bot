import { config } from "../../config/config.js";
import Log from "../util/log.js";

/**
 * DiscordBotList Handler
 *
 * @class DblHandler
 */
class DblHandler {
    /**
     * Creates an instance of DblHandler.
     *
     * @param {import("discord.js").Client} client
     * @memberof DblHandler
     */
    constructor(client){
        this.token = config.discord.dbl_token;
        this.client = client;
        this.isProd = process.env.NODE_ENV !== "development";
        // this.id = client.user?.id;
        this.id = "1108279646165942363";
    }

    /**
     * Post bot commands to discordbotlist.com
     *
     * @param {Array} cmdMap
     * @return {void}
     * @memberof DblHandler
     */
    postBotCommands(cmdMap){
        if (!this.isProd || this.token === "") return;

        fetch(`https://discordbotlist.com/api/v1/bots/${this.id}/commands`, {
            method: "post",
            headers: {
                Authorization: this.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cmdMap),
        }).then(res => res.json())
            .then(() => Log.info("Successfully reloaded " + cmdMap.length + " application (/) commands on discordbotlist.com."))
            .catch(err => Log.error("Error during registering of application (/) commands on discordbotlist.com: " + err));
    }

    /**
     * Post bot stats to discordbotlist.com
     *
     * @param {Number} guildCount
     * @return {Promise<void>}
     * @memberof DblHandler
     */
    async postBotStats(guildCount){
        if (!this.isProd || this.token === "") return;

        const members = await this.client.shard?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
        const userCount = members?.reduce((acc, memberCount) => Number(acc) + Number(memberCount), 0);

        fetch(`https://discordbotlist.com/api/v1/bots/${this.id}/stats`, {
            method: "post",
            headers: {
                Authorization: this.token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                guilds: guildCount,
                users: userCount,
            }),
        }).then(res => res.json())
            .then(() => Log.info("Updated guild count to " + guildCount + " and user count to " + userCount + " on discordbotlist.com"))
            .catch(err => Log.error("Failed to update guild count on discordbotlist.com: " + err));
    }
}

export default DblHandler;
