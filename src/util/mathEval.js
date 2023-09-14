import * as math from "mathjs";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Evaluate a math expression
 *
 * @param {String} expr
 * @return {Number}
 */
const mathEval = function(expr){
    // @ts-ignore
    const cleaned = expr.replaceAll("×", "*").replaceAll("÷", "/");

    let result;
    try { result = math.evaluate(cleaned); }
    catch (e){ result = null; }

    const resStr = math.format(result, { precision: 14 });
    const unRoundedStr = math.format(result);
    if (unRoundedStr.length - resStr.length > 4){
        result = Number(resStr);
    }

    if (result && typeof result === "object"){
        if (result.entries) result = result.entries[0];
        else if (result.re) result = result.re;
    }

    return result;
};

export default mathEval;
