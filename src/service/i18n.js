import path from "node:path";
import i18n from "i18n-light";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

i18n.configure({
    defaultLocale: "English_en",
    dir: path.resolve("./locales"),
    extension: ".json",
});

const db = new QuickDB({
    filePath: path.resolve("./data/guild_data.sqlite"),
});

/**
 * @callback context
 * @param {string|null} guild
 * @param {boolean} [quantisize=false]
 * @returns {Promise<string>}
 */
/**
 * Translate a string
 * @param {array} args
 * @returns {context}
 */
const __ = (...args) => async(guild, quantisize = false) => {
    const locale = (await db.get(`guild-${guild}.locale`)) || "English_en";
    i18n.setLocale(locale);

    let result = quantisize ? i18n.__n(...args) : i18n.__(...args);
    if (!result){
        i18n.setLocale("English_en");
        result = quantisize ? i18n.__n(...args) : i18n.__(...args);
    }

    return result;
};

export default __;
