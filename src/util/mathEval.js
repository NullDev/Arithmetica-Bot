import { create, all } from "mathjs";

import nerdamer from "nerdamer/nerdamer.core.js";
import "nerdamer/Algebra.js";
import "nerdamer/Calculus.js";
import "nerdamer/Solve.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable no-use-before-define */

const mathjs = create(all);
mathjs.config({ number: "BigNumber" });

const neutralElements = {
    "+": 0,
    "*": 1,
};

const computationLimitSecs = 5;

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
 * Parse variable declaration in form of "var = value"
 *
 * @param {String} v
 * @return {[String, Number]}
 */
const parseVar = function(v){
    const variable = String(v).split("=")[0].trim();
    const rawVal = String(v).split("=")[1].trim();

    const value = isNaN(Number(rawVal))
        ? Number(mathEval(rawVal).result)
        : Number(rawVal);

    return [variable, value];
};

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

/**
 * Iterative calculation function
 *
 * @param {String} n - start
 * @param {String} k - end
 * @param {String} expr - expression
 * @param {string} [op="+"]
 * @return {Number}
 */
const iterCalc = function(n, k, expr, op = "+"){
    const [nS, nN] = parseVar(n);
    const [kS, kN] = parseVar(k);

    let result = neutralElements[op];
    const startTime = Date.now();

    for (let i = nN; i <= kN; i++){
        if (Date.now() - startTime > computationLimitSecs * 1000){
            throw new Error("Function execution exceeded " + computationLimitSecs + " seconds");
        }

        // @ts-ignore
        const { result: res, error } = mathEval(expr.replaceAll(nS, i).replaceAll(kS, kN));
        if (error) throw new Error(error);
        if (res === null) throw new Error("Couldn't evaluate");

        if (op === "+") result += Number(res);
        if (op === "*") result *= Number(res);
    }
    if (Math.abs(result) === Infinity){
        throw new Error("Result may be Infinity");
    }

    return result;
};

/**
 * Summation function
 *
 * @param {String} n - start
 * @param {String} k - end
 * @param {String} expr - expression
 * @return {Number}
 */
const sigmaSum = function(n, k, expr){
    return iterCalc(n, k, expr, "+");
};

/**
 * Product function
 *
 * @param {String} n - start
 * @param {String} k - end
 * @param {String} expr - expression
 * @return {Number}
 */
const piProd = function(n, k, expr){
    return iterCalc(n, k, expr, "*");
};

/**
 * Tetration function
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 */
const tetration = function(a, b){
    let c = a;
    const now = Date.now();
    for (let i = 1; i < b; i++){
        if (Date.now() - now > computationLimitSecs * 1000){
            throw new Error("Function execution exceeded " + computationLimitSecs + " seconds");
        }
        c = Math.pow(a, c);
    }
    return c;
};

/**
 * Variadic equation solver
 *
 * @param {String} variable
 * @param {String[]} exprs
 * @return {Number|null}
 */
const solve = function(variable, ...exprs){
    if (exprs.length === 1){
        const res = nerdamer.solve(exprs[0], variable).toString();
        try {
            return Number(JSON.parse(res)[0]);
        }
        catch (e){
            return null;
        }
    }

    const res = nerdamer.solveEquations(exprs);
    return Number(res.find(r => r[0] === variable)[1]);
};

mathjs.import({
    totient,
    sigmaSum,
    piProd,
    tetration,
    solve,
}, { override: true });

/**
 * Evaluate a math expression
 *
 * @param {String} expr
 * @return {{ result: Number|null, error: String|null }}
 */
function mathEval(expr){
    let cleaned = expr // @ts-ignore
        .replaceAll("\\", "")
        .replaceAll("×", "*")
        .replaceAll("⋅", "*")
        .replaceAll("÷", "/")
        .replaceAll("π", "pi")
        .replaceAll("τ", "tau")
        .replaceAll("Σ", "sigmaSum")
        .replaceAll("∑", "sigmaSum")
        .replaceAll("Π", "piProd")
        .replaceAll("∏", "piProd")
        .replaceAll("↑↑", "tetration")
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
        return {
            result: null,
            error: String(e).includes("TypeError") || String(e).includes("SyntaxError")
                ? null
                : String(e).replace("Error: ", ""),
        };
    }

    if (typeof result === "function") return { result: null, error: "Couldn't evaluate (Function)" };

    if (typeof result === "object"){
        if (!result) return { result: null, error: "Couldn't evaluate (No Result)" };
        if (result.entries) result = result.entries[0];
        else if (result.re) result = result.re;
    }

    if (isNaN(result)) return { result: null, error: "Couldn't evaluate (NaN)" };

    const epsilon = Math.pow(10, Math.floor(Math.log10(Math.abs(Number(result)))) - 14);
    if (Math.abs(result - Math.round(result)) < epsilon){
        result = Math.round(result);
    }

    return { result, error: null };
}

export default mathEval;
