import { defineConfig } from "vite";
import React from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [React(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8090",
    },
  },
});
