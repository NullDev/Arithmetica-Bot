import path from "node:path";
import fs from "node:fs/promises";
import Log from "./log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Collect all nested keys from an object
 *
 * @param {Object} obj
 * @param {string} [prefix=""]
 * @return {string[]}
 */ // @ts-ignore
const collectKeys = (obj, prefix = "") => Object.entries(obj).reduce((keys, [key, value]) => {
    let newKeys = [...keys, prefix ? `${prefix}.${key}` : key];
    if (value && typeof value === "object"){
        newKeys = [...newKeys, ...collectKeys(value, prefix ? `${prefix}.${key}` : key)];
    }
    return newKeys;
}, []);

/**
 * Check if all locales have the same keys
 *
 * @return {Promise<Boolean>}
 */
const translationCheck = async function(){
    const locales = await fs.readdir(path.resolve("./locales"));
    let result = true;

    try {
        for (const locale of locales){
            if (!locale.endsWith(".json")) continue;

            const localeFile = JSON.parse(await fs.readFile(path.resolve(`./locales/${locale}`), "utf-8"));
            const localeKeys = collectKeys(localeFile);

            for (const otherLocale of locales){
                if (locale === otherLocale || !otherLocale.endsWith(".json")) continue;

                const otherLocaleFile = JSON.parse(await fs.readFile(path.resolve(`./locales/${otherLocale}`), "utf-8"));
                const otherLocaleKeys = collectKeys(otherLocaleFile);

                const missingKeys = localeKeys.filter(key => !otherLocaleKeys.includes(key));
                const additionalKeys = otherLocaleKeys.filter(key => !localeKeys.includes(key));

                if (missingKeys.length > 0){
                    Log.warn(`Missing keys in ${locale} compared to ${otherLocale}: ${missingKeys.join(", ")}`);
                    result = false;
                }

                if (additionalKeys.length > 0){
                    Log.warn(`Additional keys in ${locale} compared to ${otherLocale}: ${additionalKeys.join(", ")}`);
                    result = false;
                }
            }
        }
    }
    catch (e){
        Log.error("Failed to check translations: ", new Error(e));
        return false;
    }

    return result;
};

export default translationCheck;
