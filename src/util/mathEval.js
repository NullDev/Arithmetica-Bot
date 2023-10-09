import { create, all } from "mathjs";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const mathjs = create(all);
mathjs.config({ number: "BigNumber" });

/**
 * Evaluate a math expression
 *
 * @param {String} expr
 * @return {Number}
 */
const mathEval = function(expr){
    const cleaned = expr // @ts-ignore
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replaceAll("π", "pi")
        .replaceAll("∞", "Infinity");

    let result;
    try { result = mathjs.evaluate(cleaned); }
    catch (e){ result = null; }

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
