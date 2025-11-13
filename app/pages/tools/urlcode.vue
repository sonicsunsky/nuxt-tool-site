<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center">🔗 URL 编解码工具</h1>
    <p class="text-center text-gray-500">
      支持 encodeURIComponent / decodeURIComponent 一键编解码
    </p>

    <!-- 工具介绍 -->
    <section class="p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed">
      <h3 class="text-lg font-bold mb-2">URL 编码与解码介绍</h3>
      <p>
        URL 编码用于将特殊字符转换为安全格式，以便在网络传输中不丢失信息。
        本工具支持对文本进行编码与解码，常用于链接参数处理与 Web 开发场景。
      </p>
    </section>

    <!-- 输入框 -->
    <UTextarea
      v-model="input"
      placeholder="请输入要编码或解码的内容..."
      :rows="6"
      class="w-full font-mono"
      @keydown.shift.enter.prevent="autoHandle"
    />

    <!-- 操作按钮 -->
    <div class="flex flex-wrap justify-center gap-3 mt-4">
      <UButton color="primary" size="lg" @click="encode" :disabled="!input">
        编码 (Encode)
      </UButton>

      <UButton color="secondary" size="lg" @click="decode" :disabled="!input">
        解码 (Decode)
      </UButton>

      <UButton variant="soft" size="lg" color="neutral" @click="reset">
        清空
      </UButton>
    </div>

    <!-- 结果展示 -->
    <div v-if="result" class="mt-6">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-gray-700">结果：</h3>
        <UButton
          size="sm"
          color="info"
          variant="soft"
          icon="i-lucide-copy"
          @click="copy(result)"
        >
          复制结果
        </UButton>
      </div>

      <pre
        class="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap break-words"
        >{{ result }}</pre
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const result = ref("");
const toast = useToast();

// URL 编码
function encode() {
  if (!input.value) return;
  try {
    result.value = encodeURIComponent(input.value);
    showToast("✅ 已成功编码");
  } catch (e) {
    result.value = "❌ 编码错误：" + (e as Error).message;
    showToast("⚠️ 编码失败");
  }
}

// URL 解码
function decode() {
  if (!input.value) return;
  try {
    result.value = decodeURIComponent(input.value);
    showToast("✅ 已成功解码");
  } catch (e) {
    result.value = "❌ 解码错误：" + (e as Error).message;
    showToast("⚠️ 解码失败");
  }
}

// 智能处理（Shift+Enter 自动判断编码/解码）
function autoHandle() {
  if (!input.value) return;
  const hasEncoded = /%[0-9A-Fa-f]{2}/.test(input.value);
  hasEncoded ? decode() : encode();
}

// 清空输入
function reset() {
  input.value = "";
  result.value = "";
  showToast("已清空内容");
}

// 复制结果
async function copy(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast("📋 已复制到剪贴板");
  } catch {
    showToast("⚠️ 无法复制，请手动选择");
  }
}

// Toast 提示封装
function showToast(message: string) {
  toast.add({
    title: message,
    color: message.includes("✅") ? "success" : "neutral",
  });
}
</script>
