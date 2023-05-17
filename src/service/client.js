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
     * @param {*} options
     * @memberof DiscordClient
     */
    constructor(options){
        super(options);
        this.commands = new Collection();
    }
}

export default DiscordClient;
