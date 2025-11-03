<template>
  <div>
    <!-- Hero Section -->
    <section class="text-center py-20 bg-blue-50 rounded-2xl shadow mb-12">
      <h1 class="text-4xl font-bold mb-4">🧰 开发者工具箱 - 在线效率工具</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
        一个为开发者、设计师和内容创作者打造的多功能工具集合。
        快速处理数据、编码解析、文本处理与格式转换，提升效率，让工作更轻松。
        所有工具都可直接在浏览器中使用，无需安装任何软件。
      </p>
      <NuxtLink
        to="/tools"
        class="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        开始使用 →
      </NuxtLink>
    </section>

    <!-- Features -->
    <section class="py-16">
      <h2 class="text-2xl font-bold mb-8 text-center">
        为什么选择开发者工具箱？
      </h2>
      <div class="grid md:grid-cols-3 gap-6 text-gray-700">
        <div class="p-6 rounded-xl shadow hover:shadow-lg transition bg-white">
          <h3 class="font-semibold text-lg mb-2">完全免费</h3>
          <p>所有工具永久免费使用，不设置功能限制。</p>
        </div>
        <div class="p-6 rounded-xl shadow hover:shadow-lg transition bg-white">
          <h3 class="font-semibold text-lg mb-2">无需安装</h3>
          <p>基于 Web 技术，打开页面即可使用，不占存储空间。</p>
        </div>
        <div class="p-6 rounded-xl shadow hover:shadow-lg transition bg-white">
          <h3 class="font-semibold text-lg mb-2">安全可靠</h3>
          <p>数据仅在本地浏览器中处理，不会上传或保存。</p>
        </div>
      </div>
    </section>

    <!-- SEO 内容段：关于我们 -->
    <section class="py-16 bg-gray-50 rounded-2xl shadow">
      <div class="max-w-5xl mx-auto text-gray-700 leading-relaxed p-4">
        <h2 class="text-2xl font-bold mb-4">为开发者和创作者而生</h2>
        <p class="mb-4">
          开发者工具箱平台致力于为全球技术爱好者与数字化工作者提供便捷的在线工具服务。
          我们专注于
          JSON、编码解码、加密转换、文本编辑、颜色处理等高频技术场景，
          让工具的使用变得简单而高效，帮助你节省时间，专注于创造更有价值的内容。
        </p>
        <p>
          我们正持续扩展工具种类，包括 PDF、图片处理、文档转换等功能。
          欢迎提出建议，让我们一起打造更强大的在线工具生态。
          如果你喜欢这里，记得收藏本站，随时回来查找与使用！
        </p>
      </div>
    </section>

    <!-- Popular Tools -->
    <section class="py-16">
      <h2 class="text-2xl font-bold mb-6 text-center">推荐工具</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <ToolCard v-for="tool in hotTools" :key="tool.path" :tool="tool" />
      </div>
      <div class="text-center mt-8">
        <NuxtLink class="text-blue-600 font-semibold" to="/tools">
          浏览全部工具 →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const hotTools = [
  { name: "JSON 格式化", path: "/tools/json-formatter", desc: "格式化 JSON" },
  { name: "Base64 编解码", path: "/tools/base64", desc: "编码与解码" },
  { name: "二维码生成", path: "/tools/qr-generator", desc: "二维码图片生成" },
];
</script>
