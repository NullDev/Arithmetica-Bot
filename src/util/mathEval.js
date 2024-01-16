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
 * @return {String}
 */
const parsePowers = function(expr){
    if (/^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/.test(expr)) return expr;

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
 * Parse square roots
 *
 * @param {String} expr
 * @return {String}
 */
const parseSqrt = function(expr){
    if (!expr.includes("√")) return expr;
    // √1, √123, etc
    let c = expr.replace(/√(\d+)/g, (_, p1) => `sqrt(${p1})`);
    // √(1), √(123), √(1+2), etc
    c = c.replace(/√\((.+?)\)/g, (_, p1) => `sqrt(${p1})`);
    return c;
};

/**
 * Parse absolute values
 *
 * @param {String} expr
 * @return {String}
 *
 */
const parseAbs = function(expr){
    if (!expr.includes("|")) return expr;
    return expr.replace(/\|(.+?)\|/g, (_, p1) => `abs(${p1})`);
};

/**
 * Parse phi
 *
 * @param {String} expr
 * @return {String}
 */
const parsePhi = function(expr){
    if (!expr.includes("phi")) return expr;
    // keep phi as phi but replace phi(x) with totient(x)
    return expr.replace(/phi\((.+?)\)/g, (_, p1) => `totient(${p1})`);
};

/**
 * Greatest common divisor
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
const gcd = (a, b) => (a === 0) ? b : gcd(b % a, a);

/**
 * Eulers totient/phi function
 *
 * @param {Number} n
 * @return {Number}
 */
const totient = function(n){
    let result = 1;
    for (let i = 2; i < n; i++){
        if (gcd(i, n) === 1) result++;
    }
    return result;
};

mathjs.import({
    totient,
}, { override: true });

/**
 * Evaluate a math expression
 *
 * @param {String} expr
 * @return {Number | null}
 */
const mathEval = function(expr){
    let cleaned = expr // @ts-ignore
        .replaceAll("\\", "")
        .replaceAll("×", "*")
        .replaceAll("⋅", "*")
        .replaceAll("÷", "/")
        .replaceAll("π", "pi")
        .replaceAll("τ", "tau")
        .replaceAll("φ", "phi")
        .replaceAll("ϕ", "phi")
        .replaceAll("**", "^")
        .replaceAll("∞", "Infinity");

    cleaned = parsePowers(cleaned);
    cleaned = parseSqrt(cleaned);
    cleaned = parseAbs(cleaned);
    cleaned = parsePhi(cleaned);

    let result;
    try {
        result = mathjs.evaluate(cleaned);
    }
    catch (e){
        return null;
    }

    if (typeof result === "object"){
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
