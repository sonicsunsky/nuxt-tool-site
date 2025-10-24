<template>
  <div>
    <h2 class="text-lg font-bold mb-4">JSON 格式化</h2>
    <textarea
      v-model="input"
      rows="10"
      class="w-full border p-2 rounded"
      placeholder="粘贴 JSON 内容..."
    />
    <div class="mt-4 flex gap-2">
      <button
        @click="formatJson"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        格式化
      </button>

      <button
        @click="minifyJson"
        class="bg-gray-600 text-white px-4 py-2 rounded"
      >
        压缩
      </button>
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
