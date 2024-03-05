import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import translations from "../../../locales/commands/translations.js";
import { config } from "../../../config/config.js";
import { createCanvas, loadImage } from "canvas";

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
            return [];
        }

        if(!!res.queryresult.pods[0].primary){
            return res.queryresult.pods;
        }

        const pods = res.queryresult.pods.filter(pod => !!pod.primary);
        return [res.queryresult.pods[0], ...pods];
    });
};

const generateImage = async(pods) => {
    const width = Math.max(pods.reduce((max, pod) => Math.max(pod.subpods[0].img.width, max), 0), 250) + 20;
    const height = pods.reduce((totalHeight, pod) => totalHeight + pod.subpods[0].img.height, 80);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "black";
    const lineHeight = 20;

    let currentHeight = 0;
    for(let i = 0; i < pods.length; i++){
        const pod = pods[i];
        console.log(pod.title);
        const inputImagePod = pod.subpods[0].img;
        const image = await loadImage(inputImagePod.src);
        const inputText = pod.title;
        if(i === 0){
            ctx.fillText(inputText, 10, currentHeight + lineHeight);
            ctx.drawImage(image, 30, currentHeight + lineHeight + 5);
            currentHeight += image.height + lineHeight;
        }
        else{
            ctx.fillText(inputText, 10, currentHeight + lineHeight + 8);
            ctx.drawImage(image, 30, currentHeight + lineHeight + 13);
            currentHeight += image.height + lineHeight + 8;
        }
    }

    return canvas.toBuffer("image/png");
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
        const result = await getQuery(userInput?.value);
        const buffer = await generateImage(result);
        const resultImage = new AttachmentBuilder(buffer).setName("result.png");

        return await interaction.editReply({
            files: [resultImage],
        });
    },
};
