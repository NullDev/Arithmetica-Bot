import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import WolframAlpha from "../../service/wolframAlphaGenerator.js";
import translations from "../../../locales/commands/translations.js";

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
        .setDMPermission(false)
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

        const buffer = await wolfram.build(String(userInput?.value));
        const resultImage = new AttachmentBuilder(buffer).setName("result.png");

        return await interaction.editReply({
            files: [resultImage],
        });
    },
};
