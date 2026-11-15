import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Three pages from one component set: index.html (healthero.ai), practice.html (healthero.io), app.html (Aurora workshop).
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(import.meta.dirname, "index.html"),
        practice: path.resolve(import.meta.dirname, "practice.html"),
        app: path.resolve(import.meta.dirname, "app.html"),
      },
    },
  },
});
