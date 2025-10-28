<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">常用工具</h2>
    <div class="grid md:grid-cols-3 gap-4">
      <ToolCard v-for="tool in tools" :key="tool.path" :tool="tool" />
    </div>
  </div>
</template>

<script setup lang="ts">
const tools = [
  {
    name: "JSON 格式化",
    path: "/tools/json-formatter",
    desc: "格式化与压缩 JSON",
  },
  { name: "Base64 编解码", path: "/tools/base64", desc: "在线编码与解码" },
  { name: "正则表达式测试", path: "/tools/regex-tester", desc: "实时匹配验证" },
  { name: "JWT 解析", path: "/tools/jwt-parser", desc: "解码 JWT Token" },
  { name: "时间戳转换", path: "/tools/timestamp", desc: "时间戳与日期互转" },
  { name: "UUID 生成", path: "/tools/uuid", desc: "生成唯一标识符" },
  {
    name: "Mock 数据生成",
    path: "/tools/mock-generator",
    desc: "快速生成随机数据",
  },
  { name: "图标浏览", path: "/tools/icon-browser", desc: "在线预览常用图标" },
  { name: "CURL 构建", path: "/tools/curl-builder", desc: "构建 CURL 请求" },
  {
    name: "二维码生成",
    path: "/tools/qr-generator",
    desc: "生成可下载二维码图片",
  },
  {
    name: "颜色取值与转换",
    path: "/tools/color-converter",
    desc: "颜色选择、Hex/RGB/HSL 相互转换",
  },
  {
    name: "密码生成",
    path: "/tools/password-generator",
    desc: "自定义密码生成",
  },
  {
    name: "URL 编码/解码",
    path: "/tools/urlcode",
    desc: "URL 编码与解码",
  },
  {
    name: "文本对比",
    path: "/tools/diff",
    desc: "对比两段文本差异",
  },
];
</script>
