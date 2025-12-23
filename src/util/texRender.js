import { spawn } from "node:child_process";
import { create } from "./texWrap.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const preamble = `\\nonstopmode
\\documentclass{minimal}
\\usepackage[warnunknown, fasterrors, mathletters]{ucs}
\\usepackage[utf8x]{inputenc}
\\everymath{\\displaystyle}
\\usepackage[fontsize=14pt]{scrextend}
\\usepackage{amsfonts, amsthm, amsmath, amssymb}
\\usepackage{mathtools}
\\usepackage{cancel, textcomp}
\\usepackage[mathscr]{euscript}
\\usepackage[nointegrals]{wasysym}
\\usepackage{esint}
\\usepackage{listings}
\\usepackage{physics}
\\usepackage[active,tightpage]{preview}
\\usepackage{transparent}
\\usepackage{tikz-cd}
\\usepackage{color}
\\usepackage{microtype}
\\def\\mbb#1{\\mathbb{#1}}
\\def\\mfk#1{\\mathfrak{#1}}
\\def\\bN{\\mbb{N}}
\\def\\bC{\\mbb{C}}
\\def\\bR{\\mbb{R}}
\\def\\bQ{\\mbb{Q}}
\\def\\bZ{\\mbb{Z}}
\\newcommand{\\func}[3]{#1\\colon#2\\to#3}
\\newcommand{\\vfunc}[5]{\\func{#1}{#2}{#3},\\quad#4\\longmapsto#5}
\\newcommand{\\floor}[1]{\\left\\lfloor#1\\right\\rfloor}
\\newcommand{\\ceil}[1]{\\left\\lceil#1\\right\\rceil}
\\newtheorem{Theorem}{Theorem}
\\newtheorem{Proposition}{Theorem}
\\newtheorem{Lemma}[Theorem]{Lemma}
\\newtheorem{Corollary}[Theorem]{Corollary}
\\theoremstyle{definition}
\\newtheorem{Definition}[Theorem]{Definition}
\\usepackage[n, advantage, operators, sets, adversary, landau, probability, notions, logic, ff, mm, primitives, events, complexity, oracles, asymptotics, keys]{cryptocode}
\\usepackage{chemfig}
\\usepackage{mathdots}
\\definecolor{bg}{HTML}{36393E}
\\pagecolor{bg}
\\begin{document}
\\begin{preview}
\\color{white}
`;

// content to render

const postamble = `
\\end{preview}
\\end{document}
`;

/**
 * Render the input expression
 *
 * @param {String} expr
 * @return {import("stream").Readable}
 */
const texRender = function(expr){
    const format = "png";
    const size = 300;

    const texStream = create([
        preamble,
        expr,
        postamble,
    ], {
        command: "pdflatex",
        format: "pdf",
    });

    const convertPath = "convert";
    const convert = spawn(convertPath, [
        "-density", "" + size,
        "-quality", "100",
        "-background", "#36393E",
        "-extent", "0x0",
        "-bordercolor", "#36393E",
        "-border", "20",
        "pdf:-",
        format + ":-",
    ]);

    const result = convert.stdout;
    texStream.on("error", function(err){
        result.emit("error", err);
        convert.kill();
    }).pipe(convert.stdin);

    return result;
};

export default texRender;
