import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // "/" at a domain root; "/Portfolio/" on a GitHub Pages project site (set by the deploy workflow).
  base: process.env.SITE_BASE || "/",
  plugins: [react()],
  build: {
    target: "es2020",
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    manifest: true,
  },
});
