import { AttachmentBuilder, SlashCommandBuilder, InteractionContextType } from "discord.js";
import WolframAlpha from "../../service/wolframAlphaGenerator.js";
import translations from "../../../locales/commands/translations.js";
import defaults from "../../util/defaults.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";
const wolfram = new WolframAlpha();

export default {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(translations.ask.desc)
        .setDescriptionLocalizations(translations.ask.translations)
        .setContexts([InteractionContextType.Guild])
        .addStringOption((option) =>
            option.setName("input")
                .setDescription(translations.ask.options.question.desc)
                .setDescriptionLocalizations(translations.ask.options.question.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();
        const userInput = interaction.options.get("input");

        const embedStruct = {
            color: defaults.embed_color,
            title: ":mag:┃Wolfram Alpha",
            url: `https://www.wolframalpha.com/input/?i=${encodeURIComponent(String(userInput?.value))}`,
            footer: {
                text: `Requested by ${interaction.user.displayName ?? interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        const buffer = await wolfram.build(String(userInput?.value));
        if (!buffer){
            return await interaction.editReply({
                embeds: [{
                    ...embedStruct,
                    description: await __("errors.eval_fail")(interaction.guildId),
                }],
            });
        }

        const resultImage = new AttachmentBuilder(buffer).setName("result.png");

        const reply = {
            ...embedStruct,
            description: `\`${String(userInput?.value)}\``,
            image: {
                url: "attachment://result.png",
            },
        };

        return await interaction.editReply({
            embeds: [reply],
            files: [resultImage],
        });
    },
};
