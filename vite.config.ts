import { defineConfig } from "vite";

// Deployed to Netlify/Vercel, which serve from the domain root.
export default defineConfig({
  base: "/",
  build: {
    target: "es2020",
    assetsInlineLimit: 0,
  },
});
