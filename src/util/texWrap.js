import { spawn } from "child_process";
import path from "path";
import { createReadStream, createWriteStream, promises as fsPromises } from "fs";
import { tmpdir } from "os";
import through from "through";

const tempAffixes = {
    dir: tmpdir(),
    prefix: "node-latex",
};

let directoryBuilt = false;
let directoryErr = null;
const directoryWait = [];
let directoryPath = "/tmp";
let directoryCount = 0;

fsPromises.mkdtemp(path.join(tempAffixes.dir, tempAffixes.prefix))
    .then((dirpath) => {
        process.on("exit", () => {
            fsPromises.rm(dirpath, { recursive: true, force: true });
        });
        directoryErr = null;
        directoryPath = dirpath;
        directoryBuilt = true;
        directoryWait.forEach((callback) => callback());
        directoryWait.length = 0;
    })
    .catch((err) => {
        directoryErr = err;
    });

function awaitDir(cb){
    async function makeLocalDir(){
        if (directoryErr){
            cb(directoryErr, null);
            return;
        }
        const tempPath = path.join(directoryPath, `${directoryCount++}`);
        try {
            await fsPromises.mkdir(tempPath, { recursive: true });
            cb(null, tempPath);
        }
        catch (err){
            cb(err, null);
        }
    }
    if (directoryBuilt){
        makeLocalDir();
    }
    else {
        directoryWait.push(makeLocalDir);
    }
}

export class LatexSyntaxError extends Error {
    constructor(message, rawLog){
        super(message);
        this.rawLog = rawLog;
        const log = [];
        let errMessage;
        this.rawLog.forEach((logLine, i) => {
            if (/^!/.test(logLine)){
                if (errMessage){
                    log.push(errMessage);
                }
                errMessage = logLine;
            }
            const regex = /^l\.(\d+)(.+)/;
            if (errMessage && regex.test(logLine)){
                const matches = logLine.match(regex);
                const trace = [matches[2]];
                for (let j = i + 1; j < this.rawLog.length; ++j){
                    const stackLine = this.rawLog[j];
                    if (/^\s/.test(stackLine)){
                        trace.push(stackLine.replace(/^\s+/, "  "));
                    }
                    else {
                        break;
                    }
                }
                log.push(`Line ${matches[1]}: ${errMessage.replace(/^!\s+/, "")}\n${trace.join("\n")}`);
                log.push("");
                errMessage = undefined;
            }
        });
        this.trace = log.join("\n");
    }
}

function handleErrors(dirpath, result){
    const logFile = path.join(dirpath, "texput.log");
    fsPromises.access(logFile)
        .then(() => {
            const log = createReadStream(logFile);
            const err = [];
            log.on("data", (data) => {
                const lines = data.toString().split("\n");
                lines.forEach((line) => {
                    if (line.length > 0){
                        err.push(line);
                    }
                });
            });
            log.on("end", () => {
                if (err.length > 0){
                    result.emit("error", new LatexSyntaxError("LaTeX Syntax Error", err));
                }
                else {
                    result.emit("error", new Error("Unspecified LaTeX Error"));
                }
            });
        })
        .catch(() => {
            fsPromises.rm(dirpath, { recursive: true, force: true });
            result.emit("error", new Error("Error running LaTeX"));
        });
}

export function create(doc, options = {}){
    const { env } = process;

    const format = options.format || "pdf";
    const haltOnError = options.haltOnError || false;

    if (options.bufSize){
        env.bufSize = options.bufSize;
    }

    const texCommand = options.command || (format === "pdf" ? "pdflatex" : "latex");

    const result = through();
    awaitDir((err, dirpath) => {
        if (err){
            result.emit("error", err);
            result.end();
            return;
        }
        const inputPath = path.join(dirpath, "texput.tex");
        const texFile = createWriteStream(inputPath);

        texFile.on("close", () => {
            const texArgs = [
                "-interaction=nonstopmode",
                "texput.tex",
            ];

            if (haltOnError){
                texArgs.unshift("-halt-on-error");
            }
            const tex = spawn(texCommand, texArgs, {
                cwd: dirpath,
                env,
            });

            tex.on("error", (errI) => { // @ts-ignore
                if (errI.code === "ENOENT"){
                    console.error(`\nThere was an error spawning ${texCommand}. \nPlease make sure your LaTeX distribution is properly installed.\n`);
                }
                else {
                    handleErrors(dirpath, result);
                }
            });

            tex.on("exit", () => {
                const outputFile = path.join(dirpath, `texput.${format}`);
                fsPromises.access(outputFile)
                    .then(() => {
                        const stream = createReadStream(outputFile);
                        stream.on("close", () => {
                            fsPromises.rm(dirpath, { recursive: true, force: true });
                        });
                        stream.pipe(result);
                    })
                    .catch(() => {
                        handleErrors(dirpath, result);
                    });
            });
        });

        if (typeof doc === "string" || Buffer.isBuffer(doc)){
            texFile.end(doc);
        }
        else if (Array.isArray(doc)){
            doc.forEach((part) => texFile.write(part));
            texFile.end();
        }
        else if (doc && typeof doc.pipe === "function"){
            doc.pipe(texFile);
        }
        else {
            result.emit("error", new Error("Invalid document"));
        }
    });

    return result;
}
