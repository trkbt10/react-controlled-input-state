import { defineConfig as defineVitestConfig } from "vitest/config";
import path from "node:path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";
import { mergeConfig } from "vitest/config";

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});

const entryDir = path.resolve(__dirname, "src");
const isWatch = process.argv.includes("--watch");

const viteConfig = defineConfig({
  build: {
    target: "modules",
    outDir: "dist",
    lib: {
      entry: path.resolve(entryDir, "index.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "es") return "[name].mjs";
        if (format === "cjs") return "[name].js";
        return `[name].${format}`;
      },
    },
    minify: isWatch ? false : "terser",
    emptyOutDir: isWatch ? false : true,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {},
    },
  },
  plugins: [
    dts({
      outDir: "dist",
      include: path.resolve(entryDir, "**/*.ts*"),
    }),
  ],
});

export default mergeConfig(viteConfig, vitestConfig);
