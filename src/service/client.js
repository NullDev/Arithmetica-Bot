import { Client, Collection } from "discord.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 *  Discord Client
 *
 * @class DiscordClient
 * @extends {Client}
 */
class DiscordClient extends Client {
    /**
     *  Creates an instance of DiscordClient.
     *
     * @param {import("discord.js").ClientOptions} options
     * @memberof DiscordClient
     */
    constructor(options){
        super(options);
        this.commands = new Collection();
        this.cluster = /** @type {import("discord-hybrid-sharding").ClusterClient<DiscordClient> | undefined} */ (undefined);
    }
}

export default DiscordClient;
