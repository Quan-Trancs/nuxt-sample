// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variable.scss" as *;`,
        },
      },
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-rating',
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
  ],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/styles/mixin.scss',
    '~/assets/styles/font.scss',
    '~/assets/styles/prosemirror.scss',
    '~/assets/styles/global.scss',
  ],
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)), // set @ to root
  },
  image: {
    dir: 'public',
  },
})
