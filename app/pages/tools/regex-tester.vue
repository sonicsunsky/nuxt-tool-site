<template>
  <div>
    <h2 class="text-lg font-bold mb-4">正则表达式测试</h2>
    <input
      v-model="pattern"
      placeholder="输入正则表达式，例如：\\d+"
      class="w-full border p-2 rounded mb-2"
    />
    <textarea
      v-model="text"
      rows="6"
      class="w-full border p-2 rounded"
      placeholder="测试文本..."
    />
    <pre class="bg-gray-100 p-4 mt-4 rounded text-sm whitespace-pre-wrap">{{
      matches
    }}</pre>
  </div>
</template>

<script setup lang="ts">
const pattern = ref("");
const text = ref("");
const matches = computed(() => {
  try {
    const re = new RegExp(pattern.value, "g");
    return text.value.match(re)?.join("\n") || "无匹配结果";
  } catch {
    return "❌ 正则表达式错误";
  }
});
</script>
