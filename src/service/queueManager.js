import { EventEmitter } from "events";
import countingService from "../service/countingService.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle incomming counting messages concurrently and in order
 *
 * @class QueueManager
 */
class QueueManager {
    /**
     * Creates an instance of QueueManager.
     *
     * @memberof QueueManager
     */
    constructor(){
        this.queues = new Map();
        this.eventEmitter = new EventEmitter();
        this.cleanupInterval = 1000 * 60 * 60 * 2; // 2 hours

        this.#setupCleanup();
    }

    /**
     * Enqueue a message to be processed
     *
     * @public
     * @param {import("discord.js").Message} message
     * @return {void}
     * @memberof QueueManager
     */
    enqueueMessage(message){
        if (message.author.bot || !message.guild) return;

        if (!this.queues.has(message.guild.id)){
            const boundProcessQueue = this.#processQueue.bind(this, message.guild.id);
            this.queues.set(message.guild.id, { messages: [], lastUsed: Date.now(), listener: boundProcessQueue });
            this.eventEmitter.on(message.guild.id, boundProcessQueue);
        }

        const queueInfo = this.queues.get(message.guild.id);
        queueInfo.messages.push(message);
        queueInfo.lastUsed = Date.now();

        if (queueInfo.messages.length === 1){
            this.eventEmitter.emit(message.guild.id);
        }
    }

    /**
     * Process the queue for a guild
     *
     * @param {String} guildId
     * @return {Promise<void>}
     * @memberof QueueManager
     */
    async #processQueue(guildId){
        const queueInfo = this.queues.get(guildId);
        if (!queueInfo) return;
        while (queueInfo.messages.length > 0){
            const message = queueInfo.messages[0];
            await countingService(message);
            queueInfo.messages.shift();
        }
    }

    /**
     * Setup cleanup interval
     *
     * @memberof QueueManager
     */
    #setupCleanup(){
        setInterval(() => {
            Log.wait("[QUEUE] Cleaning up queues...");

            let removed = 0;
            const now = Date.now();
            for (const [guildId, queueInfo] of this.queues){
                if (now - queueInfo.lastUsed > this.cleanupInterval){
                    this.queues.delete(guildId);
                    this.eventEmitter.off(guildId, queueInfo.listener);
                    removed++;
                }
            }

            Log.done(`[QUEUE] Removed ${removed} old queues.`);
        }, this.cleanupInterval);
    }
}

export default QueueManager;
