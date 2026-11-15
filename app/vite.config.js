import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The Aurora workshop app. Tokens come from ../design-system/tokens.css.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
