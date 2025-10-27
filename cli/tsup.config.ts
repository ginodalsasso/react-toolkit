import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"], // Entry point of the CLI application
    format: ["esm"], // Output format as ES modules
    clean: true, // Clean the output directory before each build
    shims: true, // Include shims for Node.js built-in modules
    banner: {
        js: "#!/usr/bin/env node", // to make the CLI executable
    },
});
