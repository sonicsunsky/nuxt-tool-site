<template>
  <div>
    <h2 class="text-lg font-bold mb-4">JSON 格式化</h2>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">什么是 JSON 格式化工具？</h3>
      <p>
        JSON 格式化工具用于对 JSON 字符串进行美化、校验和压缩处理。
        它帮助开发者快速检查 JSON 是否合规，让数据结构更加清晰，提升调试效率。
        适用于前端开发、API 调试、数据库配置和日志分析等多种场景。
      </p>

      <h3 class="text-lg font-bold mt-4 mb-2">如何使用？</h3>
      <ol class="list-disc ml-6">
        <li>将 JSON 文本粘贴到输入框中</li>
        <li>点击格式化按钮，即可美化排版</li>
        <li>如果需要减少体积，可使用压缩功能</li>
        <li>支持错误检测，会提示 JSON 格式问题</li>
      </ol>

      <h3 class="text-lg font-bold mt-4 mb-2">适用示例</h3>
      <pre class="p-3 bg-white rounded overflow-auto">
{"name": "ChatGPT", "version": 5}
  </pre
      >
    </section>

    <UTextarea
      v-model="input"
      :rows="10"
      class="w-full p-2 rounded"
      placeholder="粘贴 JSON 内容..."
    />

    <div class="mt-4 flex gap-2">
      <UButton color="secondary" @click="formatJson" class="px-4 py-2 rounded">
        格式化
      </UButton>

      <UButton color="neutral" @click="minifyJson" class="px-4 py-2 rounded">
        压缩
      </UButton>
    </div>

    <pre class="bg-gray-100 p-4 mt-4 rounded overflow-auto text-sm">{{
      output
    }}</pre>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const output = ref("");

function formatJson() {
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, 2);
  } catch {
    output.value = "❌ JSON 解析错误";
  }
}

function minifyJson() {
  try {
    output.value = JSON.stringify(JSON.parse(input.value));
  } catch {
    output.value = "❌ JSON 解析错误";
  }
}
</script>
