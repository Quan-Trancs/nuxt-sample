// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys that are exposed to the server
    apiSecret: process.env.API_SECRET || "",

    // Keys within public are also exposed to the client
    public: {
      apiBase:
        process.env.API_BASE ||
        (process.env.NODE_ENV === "development"
          ? "/api"
          : "https://server.pptist.cn"),
      assetUrl: process.env.ASSET_URL || "https://asset.pptist.cn",
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: process.env.NODE_ENV === "development",
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/variable.scss" as *;
            @use "@/assets/styles/mixin.scss" as *;
          `,
        },
      },
    },
    server: {
      fs: {
        allow: ["."], // Allow root
      },
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@pinia/nuxt",
    "nuxt-rating",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  css: ["~/assets/css/main.css"],
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)), // set @ to root
  },
  image: {
    dir: "public",
  },
});
