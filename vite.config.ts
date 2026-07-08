import { defineConfig } from "vite";

// Served from https://talserphos.github.io/2027tracker/ on GitHub Pages.
// The base path must match the repository name.
export default defineConfig({
  base: "/2027tracker/",
  build: {
    target: "es2020",
    assetsInlineLimit: 0,
  },
});
