import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import WindiCSS from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve("./"),
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
