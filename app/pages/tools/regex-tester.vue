<template>
  <div>
    <h2 class="text-lg font-bold mb-4">正则表达式测试</h2>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">正则表达式测试工具介绍</h3>
      <p>
        本工具用于实时测试正则表达式与文本的匹配结果，支持全局、多行、忽略大小写等模式。
        帮助开发者快速验证表达式是否正确，提高调试效率。
      </p>

      <h3 class="text-lg font-bold mt-4 mb-2">如何使用？</h3>
      <ol class="list-disc ml-6">
        <li>输入正则表达式</li>
        <li>输入待匹配的文本内容</li>
        <li>查看匹配结果与高亮提示</li>
      </ol>
    </section>

    <UInput
      v-model="pattern"
      placeholder="输入正则表达式，例如：\\d+"
      class="w-full p-2 rounded mb-2"
    />

    <UTextarea
      v-model="text"
      :rows="6"
      class="w-full p-2 rounded"
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
