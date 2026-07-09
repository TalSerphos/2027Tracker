import { defineConfig } from "vite";

// Served from https://talserphos.github.io/2027Tracker/ on GitHub Pages.
// The base path must match the repository name EXACTLY, including case —
// GitHub Pages project-site paths are case-sensitive.
export default defineConfig({
  base: "/2027Tracker/",
  build: {
    target: "es2020",
    assetsInlineLimit: 0,
  },
});
