<template>
  <div>
    <h2 class="text-lg font-bold mb-4">JSON 格式化工具</h2>

    <!-- 说明卡片 -->
    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">工具简介</h3>
      <p>
        支持 JSON
        字符串的格式化、美化、压缩与校验，帮助开发者快速验证数据结构是否正确，
        适用于 API 调试、配置文件校验、日志格式化等场景。
      </p>
    </section>

    <!-- 操作区 -->
    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 输入区 -->
      <div>
        <h3 class="text-base font-medium mb-2">输入 JSON</h3>
        <UTextarea
          v-model="input"
          :rows="12"
          placeholder="粘贴或输入 JSON 内容..."
          class="w-full"
          @keydown.ctrl.enter.prevent="formatJson"
        />
        <div class="mt-2 flex gap-2">
          <UButton color="primary" size="xl" @click="formatJson"
            >格式化 (Ctrl+Enter)</UButton
          >
          <UButton color="neutral" size="xl" @click="minifyJson">压缩</UButton>
          <UButton color="error" size="xl" variant="soft" @click="clearAll"
            >清空</UButton
          >
        </div>
      </div>

      <!-- 输出区 -->
      <div>
        <h3 class="text-base font-medium mb-2">格式化结果</h3>
        <div
          class="relative bg-gray-100 p-3 rounded overflow-auto text-sm font-mono min-h-[260px]"
        >
          <pre :class="{ 'text-red-600': isError }">{{ output }}</pre>
          <UButton
            v-if="output"
            size="2xs"
            color="primary"
            variant="soft"
            class="absolute top-2 right-2"
            @click="copyResult"
          >
            复制结果
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const output = ref("");
const isError = ref(false);
const toast = useToast();

/** ✅ 格式化 */
function formatJson() {
  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
    isError.value = false;
    toast.add({
      title: "格式化成功 ✅",
      description: "JSON 已美化排版",
      color: "success",
    });
  } catch (err) {
    output.value = "❌ JSON 解析错误，请检查语法";
    isError.value = true;
    toast.add({
      title: "JSON 格式错误 ❌",
      description: "请输入有效的 JSON 字符串",
      color: "error",
    });
  }
}

/** ✅ 压缩 */
function minifyJson() {
  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed);
    isError.value = false;
    toast.add({
      title: "压缩成功 ✅",
      description: "JSON 已压缩为单行格式",
      color: "success",
    });
  } catch {
    output.value = "❌ JSON 解析错误，请检查语法";
    isError.value = true;
    toast.add({
      title: "JSON 格式错误 ❌",
      color: "error",
    });
  }
}

/** ✅ 清空 */
function clearAll() {
  input.value = "";
  output.value = "";
  isError.value = false;
  toast.add({
    title: "已清空 ✨",
    color: "neutral",
  });
}

/** ✅ 复制 */
function copyResult() {
  navigator.clipboard.writeText(output.value);
  toast.add({
    title: "复制成功 ✅",
    description: "结果已复制到剪贴板",
    color: "success",
  });
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
