<template>
  <div>
    <section
      class="text-center py-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl mb-16 border border-blue-200"
    >
      <h1 class="text-5xl font-extrabold text-gray-900 mb-6">
        <span class="text-blue-600">🧰 开发者工具箱</span>
        - 在线效率工具集
      </h1>
      <p class="text-xl text-gray-700 max-w-4xl mx-auto mb-8 font-medium">
        为您提供 **免费、安全、高效**
        的一站式在线工具。所有操作在浏览器中**本地完成**，保障您的数据隐私！
      </p>

      <UButton
        to="/tools"
        size="xl"
        icon="i-heroicons-arrow-right-circle"
        class="font-bold tracking-wider"
      >
        立即探索全部 {{ hotTools.length + 10 }}+ 工具 →
      </UButton>

      <div
        class="mt-8 flex justify-center gap-8 text-gray-600 text-sm flex-wrap"
      >
        <span class="flex items-center gap-1">
          <UIcon
            name="i-heroicons-lock-closed"
            class="text-green-500 text-lg"
          />
          本地处理，数据安全
        </span>
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-bolt" class="text-yellow-500 text-lg" />
          极速运行，无等待
        </span>
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-tag" class="text-blue-500 text-lg" />
          永久免费，零门槛
        </span>
      </div>
    </section>

    <section class="py-14">
      <header class="text-center mb-10">
        <h2 class="text-4xl font-bold">⭐ 热门实用工具</h2>
        <p class="mt-3 text-gray-600 text-lg">
          访问频率最高的实用工具，助您快速解决日常开发问题。
        </p>
      </header>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ToolCard
          v-for="tool in hotTools.slice(0, 8)"
          :key="tool.path"
          :tool="tool"
        />
      </div>

      <div class="text-center mt-12">
        <UButton
          to="/tools"
          variant="outline"
          size="lg"
          color="blue"
          icon="i-heroicons-squares-2x2"
        >
          查看全部工具列表
        </UButton>
      </div>
    </section>

    <section class="px-8 py-16 bg-gray-50 rounded-2xl shadow-inner my-16">
      <h2 class="text-3xl font-bold text-center mb-12">🖥️ 按分类快速查找</h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
        <NuxtLink
          v-for="category in toolCategories"
          :key="category.name"
          :to="category.link"
        >
          <UCard class="h-full hover:shadow-2xl transition duration-300">
            <div class="flex items-center mb-3">
              <UIcon
                :name="category.icon"
                class="text-3xl mr-3 text-blue-600"
              />
              <h3 class="font-bold text-xl">{{ category.name }}</h3>
            </div>
            <p class="text-sm text-gray-600">{{ category.description }}</p>
            <template #footer>
              <span class="text-sm text-blue-500 font-semibold"
                >进入分类 →</span
              >
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </section>

    <section class="py-16 text-gray-700 leading-relaxed max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">
        为技术与内容创作赋能：安全与效率并重
      </h2>
      <p class="mb-4 text-lg">
        开发者工具箱专注于解决常见的技术场景问题，包括数据处理、**Base64
        编码解码**、**JSON
        格式化美化**、**正则表达式测试**等核心功能。我们致力于帮助用户减少重复性操作，极大地提高创作与开发效率。
      </p>
      <p class="mb-4">
        **隐私声明：**
        所有工具均基于本地浏览器技术运行，保证您的数据不会上传、存储或被共享。在提升效率的同时，我们始终将您的隐私与数据安全放在首位。
      </p>
      <p class="text-center italic text-gray-500 mt-6">
        我们正在不断扩展工具类型，欢迎反馈建议！收藏本站，您将随时拥有一套随手可用的在线工具箱。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
// 引入 runtimeConfig 确保能使用全局配置（如果有）
const runtimeConfig = useRuntimeConfig();

// --- SEO 优化：使用 useHead 设置首页独有的 SEO 信息 ---
useHead({
  title: "🧰 开发者工具箱 - 免费、安全、高效的在线效率工具集",
  meta: [
    {
      name: "description",
      content:
        "为开发者、设计师与创作者打造的一站式在线工具集合。支持 JSON 格式化、Base64 编解码、正则表达式测试等核心功能，所有操作在浏览器中本地完成，安全高效。",
    },
  ],
});

// 使用 computed 属性来处理热门工具，确保动态且响应式
const hotTools = computed(() => [
  {
    name: "JSON 格式化",
    path: "/tools/json-formatter",
    icon: "i-heroicons-code-bracket",
  },
  {
    name: "Base64 编解码",
    path: "/tools/base64",
    icon: "i-heroicons-lock-closed",
  },
  {
    name: "二维码生成",
    path: "/tools/qr-generator",
    icon: "i-heroicons-qr-code",
  },
  { name: "URL 编码解码", path: "/tools/urlcode", icon: "i-heroicons-link" },
  {
    name: "正则表达式测试",
    path: "/tools/regex-tester",
    icon: "i-heroicons-magnifying-glass",
  },
  { name: "时间戳转换", path: "/tools/timestamp", icon: "i-heroicons-clock" },
  {
    name: "颜色转换",
    path: "/tools/color-converter",
    icon: "i-heroicons-paint-brush",
  },
  { name: "JWT 解析", path: "/tools/jwt-parser", icon: "i-heroicons-key" },
]);

const toolCategories = [
  {
    name: "编码 / 解码",
    link: "/tools?category=encode",
    description: "Base64, URL, JWT, HTML 实用编码解码工具，安全解析",
    icon: "i-heroicons-lock-open",
  },
  {
    name: "文本与数据处理",
    link: "/tools?category=data",
    description: "JSON、Markdown、文本对比、字符串操作与解析",
    icon: "i-heroicons-document-text",
  },
  {
    name: "开发辅助工具",
    link: "/tools?category=dev",
    description: "UUID、密码生成、CURL 构建、代码片段、图标浏览",
    icon: "i-heroicons-cog-6-tooth",
  },
  {
    name: "图像 / 颜色工具",
    link: "/tools?category=image",
    description: "图片处理、颜色转换、QR 生成、图片格式互转",
    icon: "i-heroicons-photo",
  },
];
</script>
