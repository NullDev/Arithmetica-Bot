import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const computationLimitSecs = 5;

/**
 * Evaluate a math expression using a worker process for timeout protection
 *
 * @param {String} expr
 * @return {Promise<{ result: Number|null, error: String|null }>}
 */
async function mathEval(expr){
    return new Promise((resolve) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const workerPath = join(__dirname, "mathWorker.js");

        // Spawn worker process
        const worker = spawn("node", [workerPath], {
            stdio: ["pipe", "pipe", "pipe"],
        });

        // Set up timeout
        const timeoutId = setTimeout(() => {
            worker.kill("SIGKILL");
            resolve({
                result: null,
                error: "Function execution exceeded " + computationLimitSecs + " seconds",
            });
        }, computationLimitSecs * 1000);

        let output = "";
        let errorOutput = "";

        worker.stdout.on("data", (data) => {
            output += data.toString();
        });

        worker.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        worker.on("close", (code) => {
            clearTimeout(timeoutId);

            if (code !== 0){
                resolve({
                    result: null,
                    error: errorOutput || "Worker process failed",
                });
                return;
            }

            try {
                const result = JSON.parse(output);
                resolve(result);
            }
            catch (e){
                const err = e instanceof Error ? e : new Error(String(e));
                Log.error("Error in MathEval: ", err);
                resolve({
                    result: null,
                    error: "Failed to parse worker output",
                });
            }
        });

        // Send expression to worker
        worker.stdin.write(JSON.stringify({ expression: expr }) + "\n");
        worker.stdin.end();
    });
}

export default mathEval;
