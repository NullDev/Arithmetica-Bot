import path from "node:path";
import { SlashCommandBuilder, InteractionContextType } from "discord.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
import texRender from "../../util/texRender.js";
import Log from "../../util/log.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const guildDb = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.tex.desc)
        .setDescriptionLocalizations(translations.tex.translations)
        .setContexts([InteractionContextType.Guild])
        .addStringOption((option) =>
            option.setName("expression")
                .setDescription(translations.tex.options.expression.desc)
                .setDescriptionLocalizations(translations.tex.options.expression.translations)
                .setRequired(true))
        .addBooleanOption((option) =>
            option.setName("spoiler")
                .setDescription(translations.tex.options.spoiler.desc)
                .setDescriptionLocalizations(translations.tex.options.spoiler.translations)
                .setRequired(false)),
    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        if (process.platform === "win32"){
            return await interaction.editReply(
                await __("errors.tex_on_windows")(interaction.guildId),
            );
        }

        const expr = interaction.options.get("expression")?.value;
        const spoiler = interaction.options.getBoolean("spoiler") ?? false;

        if (!expr) return await interaction.editReply({ content: await __("errors.invalid_argument")(interaction.guildId) });

        const stream = texRender(String(expr));
        if (!stream) return await interaction.editReply({ content: "¯\\_(ツ)_/¯" });

        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        const message = await interaction.editReply({
            files: [
                {
                    attachment: buffer,
                    name: spoiler ? "SPOILER_render.png" : "render.png",
                },
            ],
        });

        try {
            await message.react("<:del:1485010143799152701>");
        }
        catch (error){
            const err = error instanceof Error ? error : new Error(String(error));
            Log.error("Error adding reaction: ", err);
        }

        await guildDb.set(`guild-${interaction.guildId}.tex-${message.id}`, interaction.user.id);

        return message;
    },
};
