import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import texRender from "../../util/texRender.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.tex.desc)
        .setDescriptionLocalizations(translations.tex.translations)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName("expression")
                .setDescription(translations.tex.options.expression.desc)
                .setDescriptionLocalizations(translations.tex.options.expression.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        if (process.platform === "win32"){
            return await interaction.editReply(
                await __("errors.tex_on_windows")(interaction.guildId),
            );
        }

        const expr = interaction.options.get("expression")?.value;
        if (!expr) return await interaction.editReply({ content: await __("errors.invalid_argument")(interaction.guildId) });

        const stream = texRender(String(expr));
        if (!stream) return await interaction.editReply({ content: "¯\\_(ツ)_/¯" });

        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const buffer = Buffer.concat(chunks);

        return await interaction.editReply({
            files: [
                {
                    attachment: buffer,
                    name: "render.png",
                },
            ],
        });
    },
};
