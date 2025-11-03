export default defineAppConfig({
  //const appConfig = useAppConfig()
  ui: {},
  theme: {},
  seo: {
    siteName: "开发者工具箱 - Dev ToolBox",
    siteUrl: "https://nuxt-tool-site.vercel.app", // ✅ 换成你的真实域名
    defaultTitle: "开发者工具箱 - 稳定好用的在线开发者工具集合",
    description:
      "开发者工具箱提供 JSON 格式化、Base64 编解码、二维码生成、正则测试等数十款开发辅助工具，永久免费、安全无广告，助力高效开发。",
    keywords:
      "开发者工具箱,在线工具,JSON格式化,Base64,二维码生成,正则表达式,UUID生成,密码生成,Mock数据,时间戳转换,前端工具,程序员工具",
    image: "/images/og-cover.jpg", // ✅ 建议加一张封面
  },
});
