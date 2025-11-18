<template>
  <div class="w-full mx-auto py-12">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold mb-3 text-gray-900">
        所有在线开发者工具合集
      </h1>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
        提供高效的数据处理、编码解析、格式转换与文本处理工具。
        所有操作均支持浏览器本地处理，安全便捷，无需安装任何软件。
      </p>
    </header>

    <div
      class="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4"
    >
      <UInput
        v-model="keyword"
        size="xl"
        icon="i-heroicons-magnifying-glass"
        class="w-[420px]"
        placeholder="搜索工具，如：JSON、Base64、颜色转换..."
      />

      <div class="flex flex-wrap gap-2 md:gap-3 text-sm">
        <UButton
          @click="activeCategory = 'all'"
          size="lg"
          :color="activeCategory === 'all' ? 'primary' : 'neutral'"
          :variant="activeCategory === 'all' ? 'solid' : 'soft'"
          icon="i-heroicons-squares-2x2"
        >
          全部
        </UButton>

        <UButton
          v-for="cat in categories"
          :key="cat.name"
          @click="activeCategory = cat.key"
          size="lg"
          :color="activeCategory === cat.key ? 'primary' : 'neutral'"
          :variant="activeCategory === cat.key ? 'solid' : 'soft'"
        >
          {{ cat.name }}
        </UButton>
      </div>
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <ToolCard v-for="tool in filteredTools" :key="tool.path" :tool="tool" />
    </div>

    <UAlert
      v-if="filteredTools.length === 0"
      icon="i-heroicons-exclamation-triangle"
      color="amber"
      variant="subtle"
      title="未找到相关工具"
      description="请尝试缩短搜索关键词，或切换到“全部”分类查看所有可用工具。"
      class="mt-10"
    />

    <section class="mt-16 py-10 border-t text-gray-700 leading-relaxed">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">
        🚀 开发者工具箱的优势与核心价值
      </h2>
      <p class="mb-3">
        平台持续更新，提供丰富且实用的 Web 开发工具，满足程序开发、前端调试、
        数据解析、文档转换等场景需求，使你的工作流程更高效。
      </p>
      <p class="mb-3">
        **安全保障：**
        本站工具没有登录或注册门槛，所有数据均在**本地浏览器**完成处理，不上传任何敏感信息，确保安全可靠。
      </p>
      <div class="mt-4 text-sm text-gray-500 italic">
        您可以随时通过 GitHub 或电子邮件向我们反馈，提出新的工具需求！
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// --- SEO 优化：设置页面独有的 SEO 信息 ---
useHead({
  title: "全部在线开发者工具合集 - 开发者工具箱",
  meta: [
    {
      name: "description",
      content:
        "开发者工具箱所有工具列表：包括 JSON、Base64、正则表达式、URL 编码、颜色转换等高效处理工具。所有操作均在浏览器本地完成，安全便捷。",
    },
  ],
});

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
    desc: "JSON 美化与压缩、校验工具",
    category: "data",
    keywords: "json,格式化,美化,压缩,校验",
  },
  {
    name: "Base64 编解码",
    path: "/tools/base64",
    desc: "Base64 字符串编码解码，支持 UTF-8",
    category: "encode",
    keywords: "base64,编码,解码,utf8",
  },
  {
    name: "正则表达式测试",
    path: "/tools/regex-tester",
    desc: "实时验证、调试与匹配正则表达式",
    category: "data",
    keywords: "正则,regex,测试,匹配,表达式",
  },
  {
    name: "JWT 解析",
    path: "/tools/jwt-parser",
    desc: "解码并验证 JWT Token 内容",
    category: "encode",
    keywords: "jwt,token,解析,解码",
  },
  {
    name: "时间戳转换",
    path: "/tools/timestamp",
    desc: "Unix 时间戳与日期时间互转",
    category: "data",
    keywords: "时间戳,日期,转换,unix,timestamp",
  },
  {
    name: "UUID 生成",
    path: "/tools/uuid",
    desc: "一键生成 UUID/GUID 唯一标识符",
    category: "dev",
    keywords: "uuid,guid,生成,唯一标识",
  },
  {
    name: "Mock 数据生成",
    path: "/tools/mock-generator",
    desc: "随机生成模拟数据或 JSON 结构",
    category: "data",
    keywords: "mock,模拟,随机数据,json",
  },
  {
    name: "图标浏览",
    path: "/tools/icon-browser",
    desc: "预览常用 UI 库图标",
    category: "dev",
    keywords: "图标,icon,浏览,ui,库",
  },
  {
    name: "CURL 构建",
    path: "/tools/curl-builder",
    desc: "可视化生成或解析 curl 请求命令",
    category: "dev",
    keywords: "curl,http,请求,构建,解析",
  },
  {
    name: "二维码生成",
    path: "/tools/qr-generator",
    desc: "将文本或链接转为二维码图片",
    category: "image",
    keywords: "二维码,qr,生成,图片",
  },
  {
    name: "颜色取值与转换",
    path: "/tools/color-converter",
    desc: "RGB/HEX/HSL/CMYK 颜色格式互转",
    category: "image",
    keywords: "颜色,rgb,hex,转换,色值",
  },
  {
    name: "密码生成",
    path: "/tools/password-generator",
    desc: "生成安全、随机的高强度密码",
    category: "dev",
    keywords: "密码,生成,随机,安全",
  },
  {
    name: "URL 编码/解码",
    path: "/tools/urlcode",
    desc: "对 URL 中的特殊字符进行编码和解码",
    category: "encode",
    keywords: "url,编码,解码,encode",
  },
  {
    name: "文本对比",
    path: "/tools/diff",
    desc: "对比两段代码或文本的差异",
    category: "data",
    keywords: "文本,代码,对比,diff",
  },
  {
    name: "图片压缩",
    path: "/tools/image-compressor",
    desc: "压缩图片文件，支持 JPEG、PNG、GIF 等格式",
    category: "image",
    keywords: "图片,压缩,图片压缩,文件",
  },
];

const filteredTools = computed(() => {
  const k = keyword.value.toLowerCase().trim();
  const c = activeCategory.value;

  return tools.filter((tool) => {
    // 关键词匹配逻辑：匹配 name, desc, 或新增的 keywords 属性
    const matchKeyword =
      !k ||
      tool.name.toLowerCase().includes(k) ||
      tool.desc.toLowerCase().includes(k) ||
      tool.keywords.toLowerCase().includes(k);

    // 分类匹配逻辑
    const matchCategory = c === "all" || tool.category === c;

    return matchKeyword && matchCategory;
  });
});
</script>
