import { config } from "../../config/config.js";
import { createCanvas, loadImage } from "canvas";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Get and display results from WolframAlpha
 *
 * @class WolframAlpha
 */
class WolframAlpha {
    #token;
    #endpoint;

    /**
     * Creates an instance of WolframAlpha.
     *
     * @constructor
     * @memberof WolframAlpha
     */
    constructor(){
        this.#token = config.discord.wolfram_appid;
        this.#endpoint = "http://api.wolframalpha.com/v2/query?";
        this.settings = {
            format: "image,plaintext",
            reinterpret: "true",
            units: "metric",
            output: "json",
        };
    }

    /**
     * Send a query to WolframAlpha
     *
     * @param {String} query
     * @return {Promise<Array>}
     * @memberof WolframAlpha
     */
    async #getQuery(query){
        const payload = {
            input: encodeURIComponent(query),
            appid: this.#token,
            ...this.settings,
        };

        const formattedPayload = Object.entries(payload)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

        return await fetch(this.#endpoint + formattedPayload, {
            method: "GET",
        }).then(async(res) => await res.json()).then(async(res) => {
            if (res.queryresult === undefined
                || res.queryresult.pods.length < 2
                || res.queryresult.pods[1].subpods.length < 1){
                return [];
            }

            if (!!res.queryresult.pods[0].primary) return res.queryresult.pods;

            const pods = res.queryresult.pods.filter(pod => !!pod.primary);
            if(pods.length > 0) return [res.queryresult.pods[0], ...pods];

            return res.queryresult.pods;
        });
    }

    /**
     * Generate an image from the pods
     *
     * @param {Array} pods
     * @return {Promise<Buffer>}
     * @memberof WolframAlpha
     */
    async #generateImage(pods){
        const lineHeight = 20;
        const width = Math.max(pods.reduce((max, pod) => Math.max(pod.subpods[0].img.width, max), 0), 400) + 40;
        const height = pods.reduce((totalHeight, pod) => totalHeight + pod.subpods[0].img.height, pods.length * lineHeight + lineHeight);
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "bold 15px sans-serif";
        ctx.fillStyle = "black";

        let currentHeight = 0;
        for (let i = 0; i < pods.length; i++){
            const pod = pods[i];
            const inputImagePod = pod.subpods[0].img;
            const image = await loadImage(inputImagePod.src);
            const inputText = pod.title;
            if (i === 0){
                ctx.fillText(inputText, 10, currentHeight + lineHeight);
                ctx.drawImage(image, 30, currentHeight + lineHeight + 5);
                currentHeight += image.height + lineHeight;
            }
            else {
                ctx.fillText(inputText, 10, currentHeight + lineHeight + 8);
                ctx.drawImage(image, 30, currentHeight + lineHeight + 13);
                currentHeight += image.height + lineHeight + 8;
            }
        }

        return canvas.toBuffer("image/png");
    }

    /**
     * Build the image from the input
     *
     * @param {String} input
     * @return {Promise<Buffer>}
     * @memberof WolframAlpha
     */
    async build(input){
        const result = await this.#getQuery(input);
        const buffer = await this.#generateImage(result);
        return buffer;
    }
}

export default WolframAlpha;
