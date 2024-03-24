import path from "node:path";
import { config } from "../../config/config.js";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";

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
        try {
            const s = await db.all();
            const m = s.map(({ id, value }) => `${id}: ${value}`).join("\n");
            await message.channel.send(m);
        }
        catch (e){
            Log.error(e);
        }
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
        catch (e){
            Log.error(e);
        }
    }
    else if (cont.toLowerCase().startsWith(".im")){
        const s = cont.split(" ");
        const c = s[1].trim();
        const i = s[2].trim();
        const m = s.slice(3).join(" ").trim();
        if (!i || !m || !c) return;
        try {
            const d = await message.client.channels.fetch(c).catch(() => null);
            if (!d) return; // @ts-ignore
            const u = await d.guild.members.fetch(i).catch(() => null);
            if (!u) return;
            const n = u?.nickname || u?.displayName || u?.username;
            const a = (u?.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png").replace(".gif", ".png"); // @ts-ignore
            const w = await d.createWebhook({ name: n, avatar: a });
            await w.send({ content: m, username: n, avatarURL: a });
            await w.delete();
        }
        catch (e){
            Log.error(e);
        }
    }
};

export default devCmd;
