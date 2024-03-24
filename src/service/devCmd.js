import path from "node:path";
import { config } from "../../config/config.js";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/cmd_stats.sqlite"),
});

// Dev-only debug stuff

/**
 * Handle DM messages
 *
 * @param {import("discord.js").Message} message
 */
const devCmd = async function(message){ // @ts-ignore
    if (!config.discord.bot_owner_ids.includes(message.author.id)) return;

    const cont = message.content;
    if (cont.toLowerCase().startsWith(".cmdstats")){
        const stats = await db.all();
        const statsStr = stats.map(({ id, value }) => `${id}: ${value}`).join("\n");
        await message.channel.send(statsStr);
    }

    else if (cont.toLowerCase().startsWith(".gw")){
        const s = cont.split(" ");
        const i = s[1].trim();
        let r = s[2].trim();
        if (!r.startsWith("r:")) r = "";
        const m = s.slice(2).join(" ").trim();
        if (!i || !m) return;
        try {
            const c = await message.client.channels.fetch(i).catch(() => null);
            if (!c) return;

            if (r !== ""){ // @ts-ignore
                const d = await c.messages.fetch(r.slice(2)).catch(() => null);
                if (!d) return;
                await d.reply(m.replace(r, "")).catch(() => null);
                return;
            } // @ts-ignore
            await c.send(m).catch(() => null);
        }
        catch (e){ /* */ }
    }
};

export default devCmd;
