process.env.STANDALONE_CLOUDFLARE = "1";
process.argv = [process.execPath, "scripts/run-framework.mjs", "build"];
await import("./run-framework.mjs");
