// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const API = "https://nulldev.org/mathfacts/api/facts/random";

/**
 * Get a random math fact
 *
 * @return {Promise<{ fact: string, proof: string|null }>} The math fact, or "¯\\_(ツ)_/¯" if an error occurred
 */
const getRandomMathFact = async function(){
    const response = await fetch(API);
    if (!response.ok) return "¯\\_(ツ)_/¯";

    const data = await response.json();
    if (!data || typeof data.content !== "string" || typeof data.id !== "number"){
        return "¯\\_(ツ)_/¯";
    }

    return { fact: data.content, proof: data.proof };
};

export default getRandomMathFact;
