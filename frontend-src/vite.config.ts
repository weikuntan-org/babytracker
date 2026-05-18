import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    build: {
        outDir: resolve(__dirname, "../custom_components/babytracker/frontend"),
        emptyOutDir: false,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "src/babytracker-card.ts"),
            formats: ["es"],
            fileName: () => "babytracker-card.js"
        },
        rollupOptions: {
            external: [],
            output: {
                inlineDynamicImports: true
            }
        }
    }
});
