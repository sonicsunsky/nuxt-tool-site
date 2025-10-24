<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Base64 编解码</h2>
    <textarea
      v-model="input"
      rows="6"
      class="w-full border p-2 rounded"
      placeholder="输入文本..."
    />
    <div class="mt-4 flex gap-2">
      <button @click="encode" class="bg-blue-600 text-white px-4 py-2 rounded">
        编码
      </button>
      <button @click="decode" class="bg-gray-600 text-white px-4 py-2 rounded">
        解码
      </button>
    </div>
    <pre class="bg-gray-100 p-4 mt-4 rounded text-sm">{{ output }}</pre>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const output = ref("");

function encode() {
  output.value = btoa(unescape(encodeURIComponent(input.value)));
}
function decode() {
  try {
    output.value = decodeURIComponent(escape(atob(input.value)));
  } catch {
    output.value = "❌ 解码错误";
  }
}
</script>
