import fs from "node:fs/promises";
import Log from "../src/util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * @param {any} item
 * @returns {item is Record<string, unknown>}
 */
const isObject = item => item && typeof item === "object" && !Array.isArray(item);

/**
 * Deep Merge of two objects
 *
 * @param {object} target
 * @param {object} source
 * @return {import("./config.template.js").default}
 */
const deepMerge = function(target, source){
    if (isObject(target) && isObject(source)){
        for (const key in source){
            if (isObject(source[key])){
                if (!target[key]) target[key] = {};
                deepMerge(target[key], source[key]);
            }
            else target[key] = source[key];
        }
    }
    return target;
};

try {
    await fs.access("./config/config.js");
}
catch (error){
    Log.error("Config file not found. To create one, either copy 'config.template.js' and rename it to 'config.custom.js' or run 'npm run generate-config'.");
    process.exit(1);
}

try {
    await fs.access("./config/config.template.js");
}
catch (error){
    Log.error("Config template file not found. This is needed to read default values. Please re-clone the repository.");
    process.exit(1);
}

// @ts-ignore
const configCustom = (await import("./config.custom.js")).default;
const configBase = (await import("./config.template.js")).default;

const packageJSON = JSON.parse(await fs.readFile("./package.json", "utf-8"));

export const meta = {
    getVersion: () => packageJSON.version,
    getName: () => packageJSON.name,
    getAuthor: () => packageJSON.author,
};

export const config = {
    ...deepMerge(configBase, configCustom),
};
