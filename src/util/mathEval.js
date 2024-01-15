import { create, all } from "mathjs";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const mathjs = create(all);
mathjs.config({ number: "BigNumber" });

/**
 * Parse powers
 *
 * @param {String} expr
 * @return {String|null}
 */
const parsePowers = function(expr){
    if (/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/.test(expr)) return null;

    const superscriptMap = {
        "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
        "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
    };

    return expr.replace(/(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, p1, p2) => {
        const normalNumbers = Array.from(p2).map(s => superscriptMap[s]).join("");
        return `${p1}^(${normalNumbers})`;
    });
};

/**
 * Evaluate a math expression
 *
 * @param {String} expr
 * @return {Number | null}
 */
const mathEval = function(expr){
    let cleaned = expr // @ts-ignore
        .replaceAll("×", "*")
        .replaceAll("⋅", "*")
        .replaceAll("÷", "/")
        .replaceAll("π", "pi")
        .replaceAll("∞", "Infinity");

    cleaned = parsePowers(cleaned) ?? cleaned;

    let result;
    try {
        result = mathjs.evaluate(cleaned);
    }
    catch (e){
        return null;
    }

    if (result && typeof result === "object"){
        if (result.entries) result = result.entries[0];
        else if (result.re) result = result.re;
    }

    const epsilon = Math.pow(10, Math.floor(Math.log10(Math.abs(Number(result)))) - 14);
    if (Math.abs(result - Math.round(result)) < epsilon){
        result = Math.round(result);
    }

    return result;
};

export default mathEval;
