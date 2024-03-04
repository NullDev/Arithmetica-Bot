import { SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import { config } from "../../../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const commandName = import.meta.url.split("/").pop()?.split(".").shift() ?? "";
const ENDPOINT = "http://api.wolframalpha.com/v2/query?";

const getQuery = async(query, args) => {
    const payload = {
        input: encodeURIComponent(query),
        appid: config.discord.wolfram_appid,
        format: "image,plaintext",
        reinterpret: "true",
        units: "metric",
        output: "json",
        ...args,
    };

    const formattedPayload = Object.entries(payload)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
    return await fetch(ENDPOINT + formattedPayload, {
        method: "GET",
    }).then(async(res) => await res.json()).then(async(res) => {
        if(res.queryresult === undefined
            || res.queryresult.pods.length < 2
            || res.queryresult.pods[1].subpods.length < 1){
            return "No result";
        }
        return res.queryresult.pods[1].subpods[0].img.src;
    });
};

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
        return await interaction.editReply({
            content: await getQuery(userInput?.value) ?? "No result",
        });
    },
};
