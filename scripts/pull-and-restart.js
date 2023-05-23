#!/usr/bin/node
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import checkDependencies from "check-dependencies";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const execAsync = promisify(exec);
const ecosystemPath = path.resolve("./pm2.ecosystem.json");
const isNpmInstallNeeded = async() => !(await checkDependencies())?.depsWereOk;

try {
    console.log("[pull-and-restart] Pulling latest changes from git...");
    await execAsync("git pull");
    console.log("[pull-and-restart] Done.");

    console.log("[pull-and-restart] Checking for missing dependencies...");
    const npmCiNeeded = await isNpmInstallNeeded();
    if (npmCiNeeded){
        console.log("[pull-and-restart] Missing or outdated dependencies detected. Installing...");
        await execAsync("npm ci");
        console.log("[pull-and-restart] Done.");
    }
    else console.log("[pull-and-restart] No missing dependencies detected. Skipping...");

    console.log("[pull-and-restart] Installing dependencies...");
    await execAsync("npm ci");
    console.log("[pull-and-restart] Done.");

    console.log("[pull-and-restart] Restarting...");
    await execAsync(`pm2 startOrReload ${ecosystemPath}`);
    console.log("[pull-and-restart] Done.");
}
catch (e){
    console.log("[pull-and-restart] An error occurred:");
    console.error(e);
    process.exit(1);
}
