<template>
  <div>
    <h2 class="text-lg font-bold mb-4">JWT Token 解析工具</h2>

    <!-- 介绍说明 -->
    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">工具简介</h3>
      <p>
        JWT（JSON Web Token）
        通常用于用户身份验证和数据安全传输。它由三部分组成：
        <code>Header</code>、<code>Payload</code> 和
        <code>Signature</code>。本工具可以快速解析前两部分内容，并以 JSON
        格式展示。
      </p>
      <p class="mt-2 text-sm text-gray-500">
        ⚠️ 所有解析均在本地浏览器中完成，不会上传任何数据。
      </p>
    </section>

    <!-- 输入区 -->
    <div class="mt-6">
      <UTextarea
        v-model="token"
        :rows="6"
        placeholder="粘贴 JWT Token，例如：xxxxx.yyyyy.zzzzz"
        class="w-full font-mono"
      />
      <div class="mt-2 flex gap-2">
        <UButton color="primary" @click="parseJwt">解析</UButton>
        <UButton color="error" variant="soft" @click="clearAll">清空</UButton>
      </div>
    </div>

    <!-- 输出区 -->
    <div v-if="header || payload" class="mt-8 grid md:grid-cols-2 gap-4">
      <div class="relative bg-gray-50 p-4 rounded-xl border">
        <h3 class="font-semibold mb-2">Header</h3>
        <pre class="bg-white p-3 rounded text-sm overflow-auto min-h-[150px]">{{
          header
        }}</pre>
        <UButton
          size="xl"
          color="primary"
          variant="soft"
          class="absolute top-2 right-2"
          @click="copy(header, 'Header')"
        >
          复制
        </UButton>
      </div>

      <div class="relative bg-gray-50 p-4 rounded-xl border">
        <h3 class="font-semibold mb-2">Payload</h3>
        <pre class="bg-white p-3 rounded text-sm overflow-auto min-h-[150px]">{{
          payload
        }}</pre>
        <UButton
          size="xl"
          color="primary"
          variant="soft"
          class="absolute top-2 right-2"
          @click="copy(payload, 'Payload')"
        >
          复制
        </UButton>
      </div>
    </div>

    <div v-if="error" class="text-red-600 mt-4 text-sm font-medium">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const token = ref("");
const header = ref("");
const payload = ref("");
const error = ref("");
const toast = useToast();

/** ✅ 解析 JWT Token */
function parseJwt() {
  header.value = "";
  payload.value = "";
  error.value = "";

  if (!token.value || !token.value.includes(".")) {
    error.value = "⚠️ 无效的 JWT Token 格式";
    return;
  }

  try {
    const [h, p] = token.value.split(".");
    header.value = JSON.stringify(JSON.parse(atob(h)), null, 2);
    payload.value = JSON.stringify(JSON.parse(atob(p)), null, 2);
    toast.add({
      title: "解析成功 ✅",
      description: "JWT 已成功解析",
      color: "success",
    });
  } catch (e) {
    error.value = "❌ 无法解析 JWT，请检查格式是否正确";
    toast.add({
      title: "解析失败 ❌",
      description: "请确保输入合法的 JWT Token",
      color: "error",
    });
  }
}

/** ✅ 一键复制 */
function copy(value: string, label: string) {
  if (!value) return;
  navigator.clipboard.writeText(value);
  toast.add({
    title: "复制成功 ✅",
    description: `${label} 已复制到剪贴板`,
    color: "success",
  });
}

/** ✅ 清空输入与结果 */
function clearAll() {
  token.value = "";
  header.value = "";
  payload.value = "";
  error.value = "";
  toast.add({
    title: "已清空 ✨",
    color: "neutral",
  });
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
