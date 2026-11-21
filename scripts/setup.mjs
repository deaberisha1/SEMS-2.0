import { execSync } from "node:child_process";

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: "inherit" });

run("npm install", "server");
run("npm install --include=dev", "client");
