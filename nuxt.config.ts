// https://nuxt.com/docs/api/configuration/nuxt-config
//defineNuxtConfig 辅助函数是全局可用的，无需导入
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      siteUrl: "https://nuxt-tool-site.vercel.app", // <- 改成你的域名（不要末尾斜杠）
      siteName: "开发者工具箱",
      defaultOgImage: "/images/og-cover.jpg", // 可选站点默认图
    },
  },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: false,
  },
  site: {
    url: "https://nuxt-tool-site.vercel.app", // ✅换成你自己的域名
  },
  sitemap: {
    strictNuxtContentPaths: true,
    autoI18n: true, // 如果未来你加多语言，能自动处理
  },
  robots: {
    disallow: [], // ✅允许所有内容被抓取
  },
});
