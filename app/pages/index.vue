<template>
  <div>
    <!-- Hero Section -->
    <section
      class="text-center py-20 bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl shadow mb-16"
    >
      <h1 class="text-4xl font-bold mb-4">🧰 开发者工具箱 - 在线效率工具集</h1>
      <p class="text-lg text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
        为开发者、设计师与创作者打造的一站式在线工具集合。
        支持数据处理、格式转换、编码解析、文本编辑等场景，
        所有操作在浏览器中本地完成，安全高效。
      </p>
      <NuxtLink
        to="/tools"
        class="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        立即探索工具 →
      </NuxtLink>
    </section>

    <!-- Popular Tools -->
    <section class="py-14">
      <header class="text-center mb-8">
        <h2 class="text-3xl font-bold">热门实用工具</h2>
        <p class="mt-2 text-gray-600 text-base">
          访问频率最高的实用在线工具，提升效率从这里开始！
        </p>
      </header>

      <!-- 🔥 首页主内容块（承载首屏广告下方） -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ToolCard
          v-for="tool in hotTools.slice(0, 8)"
          :key="tool.path"
          :tool="tool"
        />
      </div>

      <div class="text-center mt-10">
        <NuxtLink
          class="inline-block px-6 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-600 hover:text-white transition"
          to="/tools"
        >
          查看全部工具 →
        </NuxtLink>
      </div>
    </section>

    <!-- Tools Categories -->
    <section class="px-8 py-16 bg-gray-50 rounded-2xl shadow my-16">
      <h2 class="text-2xl font-bold text-center mb-10">按分类查找工具</h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
        <NuxtLink
          v-for="category in toolCategories"
          :key="category.name"
          :to="category.link"
          class="p-6 bg-white rounded-xl shadow hover:shadow-lg transition block"
        >
          <h3 class="font-semibold text-lg mb-2">{{ category.name }}</h3>
          <p class="text-sm text-gray-600">{{ category.description }}</p>
        </NuxtLink>
      </div>
    </section>

    <!-- ✅ 广告建议位置：工具分类后、SEO 内容前 -->
    <!-- <AdsenseAd slot="home-category-ad" /> -->

    <!-- SEO About Content -->
    <section class="py-20 text-gray-700 leading-relaxed max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-6 text-center">为技术与内容创作赋能</h2>
      <p class="mb-4">
        开发者工具箱专注于常见的技术场景，如数据处理、编码解码、图像格式转换、
        JSON 和文本编辑，旨在帮助用户减少重复性操作，提高创作与开发效率。
      </p>
      <p class="mb-4">
        所有工具均基于本地浏览器技术运行，不会上传用户数据，
        在提升效率的同时确保隐私与安全。
      </p>
      <p>
        我们正在不断扩展工具类型，欢迎反馈建议！
        收藏本站，您将随时拥有一套随手可用的在线工具箱。
      </p>
    </section>

    <!-- ✅ 广告建议位置 Page Bottom -->
    <!-- <AdsenseAd slot="home-bottom-ad" /> -->
  </div>
</template>

<script setup lang="ts">
const hotTools = [
  { name: "JSON 格式化", path: "/tools/json-formatter" },
  { name: "Base64 编解码", path: "/tools/base64" },
  { name: "二维码生成", path: "/tools/qr-generator" },
  { name: "URL 编码解码", path: "/tools/urlcode" },
  { name: "正则表达式测试", path: "/tools/regex-tester" },
  { name: "颜色转换", path: "/tools/color-converter" },
  { name: "时间戳转换", path: "/tools/timestamp" },
  // { name: "HTML 转义", path: "/tools/html-escape" },
];

const toolCategories = [
  {
    name: "编码 / 解码",
    link: "/tools?category=encode",
    description: "Base64, URL, HTML 实用编码解码工具",
  },
  {
    name: "文本与数据处理",
    link: "/tools?category=data",
    description: "JSON、字符串、文本操作与解析",
  },
  {
    name: "图像 / 颜色工具",
    link: "/tools?category=image",
    description: "图片处理、颜色转换、QR 生成等",
  },
  {
    name: "格式转换工具",
    link: "/tools?category=format",
    description: "常见开发格式互转，一键搞定",
  },
];
</script>
