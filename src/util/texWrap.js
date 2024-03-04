import { spawn } from "child_process";
import path from "path";
import { createReadStream, createWriteStream, promises as fsPromises } from "fs";
import { Transform } from "stream";
import { tmpdir } from "os";

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

/**
 * Create a new temporary directory and pass the path to the callback
 *
 * @param {Function} cb
 */
const awaitDir = function(cb){
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
    if (directoryBuilt) makeLocalDir();
    else directoryWait.push(makeLocalDir);
};

/**
 * Create a new LaTeX document
 *
 * @param {String|Buffer|import("stream").Readable|Array} doc
 * @param {Object} [options={}]
 * @return {import("stream").Readable}
 */
const create = function(doc, options = {}){
    const { env } = process;

    const format = options.format || "pdf";
    const haltOnError = options.haltOnError || false;

    if (options.bufSize) env.bufSize = options.bufSize;

    const texCommand = options.command || (format === "pdf" ? "pdflatex" : "latex");

    const result = new Transform({
        transform(chunk, _, callback){
            this.push(chunk);
            callback();
        },
    });

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

            if (haltOnError) texArgs.unshift("-halt-on-error");

            const tex = spawn(texCommand, texArgs, {
                cwd: dirpath,
                env,
            });

            tex.on("error", (errI) => result.emit("error", errI));

            tex.on("exit", () => {
                const outputFile = path.join(dirpath, `texput.${format}`);
                fsPromises.access(outputFile)
                    .then(() => {
                        const stream = createReadStream(outputFile);
                        stream.on("end", () => result.end())
                            .on("error", (errI) => result.emit("error", errI));
                        stream.pipe(result);
                    })
                    .catch(() => result.emit("error", new Error("Failed to create output file")));

                const parentDir = path.resolve(dirpath, "..");
                fsPromises.rm(parentDir, { recursive: true, force: true });
            });
        });

        if (typeof doc === "string" || Buffer.isBuffer(doc)) texFile.end(doc);
        else if (Array.isArray(doc)){
            doc.forEach((part) => texFile.write(part));
            texFile.end();
        }
        else if (doc && typeof doc.pipe === "function") doc.pipe(texFile);
        else  result.emit("error", new Error("Invalid document"));
    });

    return result;
};

export { create };
