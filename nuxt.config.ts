// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  nitro: {
    preset: "netlify",
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-headlessui",
    "@nuxtjs/google-fonts",
  ],

  googleFonts: {
    families: {
      Inter: [400, 600, 700],
    },
  },
});
