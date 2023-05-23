#!/usr/bin/node
import path from "node:path";
import { exec } from "node:child_process";
import checkDependencies from "check-dependencies";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const ecosystemPath = path.resolve("./pm2.ecosystem.json");
const isNpmInstallNeeded = async() => !(await checkDependencies())?.depsWereOk;
const customPm2Home = process.argv[2];

const pm2 = !!customPm2Home
    ? `PM2_HOME=${customPm2Home} pm2`
    : "pm2";

const execAsync = command => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr);
        if (error) return reject(error);
        return resolve({ stdout, stderr });
    });
});

try {
    console.log("[pull-and-restart] Pulling latest changes from git...");
    await execAsync("git pull");
    console.log("[pull-and-restart] Done.");

    console.log("[pull-and-restart] Checking for missing dependencies...");
    if (await isNpmInstallNeeded()){
        console.log("[pull-and-restart] Missing or outdated dependencies detected. Installing...");
        await execAsync("npm ci");
        console.log("[pull-and-restart] Done.");
    }
    else console.log("[pull-and-restart] No missing dependencies detected. Skipping...");

    console.log("[pull-and-restart] Restarting via pm2...");
    await execAsync(`${pm2} startOrReload ${ecosystemPath} --silent`);
    console.log("[pull-and-restart] Done.");

    console.log("[pull-and-restart] Saving pm2 list...");
    await execAsync(`${pm2} save`);
    console.log("[pull-and-restart] Done.");

    console.log("[pull-and-restart] Pull and restart completed successfully.");
}
catch (e){
    console.log("[pull-and-restart] An error occurred:");
    console.error(e);
    console.log("[pull-and-restart] Pull and restart failed.");
    process.exit(1);
}
