// https://nuxt.com/docs/api/configuration/nuxt-config
//defineNuxtConfig 辅助函数是全局可用的，无需导入
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/image", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: false,
  },
});
