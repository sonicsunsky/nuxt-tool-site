<template>
  <div class="w-full mx-auto py-12">
    <!-- SEO Header -->
    <header class="text-center mb-12">
      <h1 class="text-3xl font-bold mb-3">在线开发者工具合集</h1>
      <p class="text-gray-600 max-w-2xl mx-auto leading-relaxed">
        高效的数据处理、编码解析、格式转换与文本处理工具集合。
        所有工具均支持浏览器本地处理，安全便捷，无需安装软件。
      </p>
    </header>

    <!-- Search & Filter -->
    <div class="flex justify-between items-center mb-10 gap-4">
      <UInput
        v-model="keyword"
        size="xl"
        class="p-3 rounded-lg w-[40%]"
        placeholder="搜索工具，如：JSON、Base64、颜色转换..."
      />

      <div class="flex flex-wrap gap-3 text-sm">
        <UButton
          v-for="cat in categories"
          :key="cat.name"
          @click="activeCategory = cat.key"
          class="px-4 py-2 rounded-lg transition"
          :color="activeCategory === cat.key ? 'secondary' : 'neutral'"
        >
          {{ cat.name }}
        </UButton>

        <UButton
          @click="activeCategory = 'all'"
          class="px-4 py-2 rounded-lg transition"
          :color="activeCategory === 'all' ? 'secondary' : 'neutral'"
        >
          全部
        </UButton>
      </div>
    </div>

    <!-- Tool List -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ToolCard v-for="tool in filteredTools" :key="tool.path" :tool="tool" />
    </div>

    <!-- No Results -->
    <p
      v-if="filteredTools.length === 0"
      class="text-center text-gray-500 mt-10"
    >
      未找到相关工具，请尝试其他关键词或分类
    </p>

    <!-- SEO Bottom Description -->
    <section class="mt-16 text-gray-700 leading-relaxed">
      <h2 class="text-xl font-semibold mb-4">开发者工具箱的优势</h2>
      <p class="mb-3">
        平台持续更新，提供丰富且实用的 Web 开发工具，满足程序开发、前端调试、
        数据解析、文档转换等场景需求，使你的工作流程更高效。
      </p>
      <p>
        所有没有登录或注册门槛，所有数据均在本地浏览器完成处理，确保安全可靠。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const keyword = ref("");
const activeCategory = ref("all");

const categories = [
  { key: "encode", name: "编码 / 解码" },
  { key: "data", name: "数据与文本处理" },
  { key: "dev", name: "开发辅助" },
  { key: "image", name: "图像 / 颜色处理" },
];

const tools = [
  {
    name: "JSON 格式化",
    path: "/tools/json-formatter",
    desc: "JSON 美化与压缩",
    category: "data",
  },
  {
    name: "Base64 编解码",
    path: "/tools/base64",
    desc: "编码解码工具",
    category: "encode",
  },
  {
    name: "正则表达式测试",
    path: "/tools/regex-tester",
    desc: "实时验证正则表达式",
    category: "data",
  },
  {
    name: "JWT 解析",
    path: "/tools/jwt-parser",
    desc: "解码 JWT Token",
    category: "encode",
  },
  {
    name: "时间戳转换",
    path: "/tools/timestamp",
    desc: "时间戳与日期互转",
    category: "data",
  },
  {
    name: "UUID 生成",
    path: "/tools/uuid",
    desc: "生成唯一标识符",
    category: "dev",
  },
  {
    name: "Mock 数据生成",
    path: "/tools/mock-generator",
    desc: "随机模拟数据",
    category: "data",
  },
  {
    name: "图标浏览",
    path: "/tools/icon-browser",
    desc: "预览常用图标",
    category: "dev",
  },
  {
    name: "CURL 构建",
    path: "/tools/curl-builder",
    desc: "生成 curl 请求命令",
    category: "dev",
  },
  {
    name: "二维码生成",
    path: "/tools/qr-generator",
    desc: "生成二维码图片",
    category: "image",
  },
  {
    name: "颜色取值与转换",
    path: "/tools/color-converter",
    desc: "RGB/HEX 颜色转换",
    category: "image",
  },
  {
    name: "密码生成",
    path: "/tools/password-generator",
    desc: "安全随机密码生成",
    category: "dev",
  },
  {
    name: "URL 编码/解码",
    path: "/tools/urlcode",
    desc: "URL 字符处理",
    category: "encode",
  },
  {
    name: "文本对比",
    path: "/tools/diff",
    desc: "对比两段文本差异",
    category: "data",
  },
];

const filteredTools = computed(() => {
  return tools.filter((tool) => {
    const matchKeyword =
      tool.name.includes(keyword.value) || tool.desc.includes(keyword.value);
    const matchCategory =
      activeCategory.value === "all" || tool.category === activeCategory.value;
    return matchKeyword && matchCategory;
  });
});
</script>
