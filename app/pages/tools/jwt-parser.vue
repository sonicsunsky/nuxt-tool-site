<template>
  <div>
    <h2 class="text-lg font-bold mb-4">JWT Token 解析</h2>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">什么是 JWT 解析工具？</h3>
      <p>
        JWT Token 用于用户鉴权与安全通信，包含 Header、Payload 和 Signature。
        本工具可解析 JWT 内容并展示其 JSON 数据结构，用于调试认证系统与 API
        安全。 所有处理在本地完成，数据不会上传服务器。
      </p>
    </section>

    <UTextarea
      v-model="token"
      :rows="6"
      autoresize
      class="w-full p-2 rounded"
      placeholder="粘贴 JWT Token，例如：xxxxx.yyyyy.zzzzz"
    />

    <div v-if="header || payload" class="mt-6 grid md:grid-cols-2 gap-4">
      <div>
        <h3 class="font-semibold mb-2">Header</h3>
        <pre class="bg-gray-100 p-3 rounded text-sm">{{ header }}</pre>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Payload</h3>
        <pre class="bg-gray-100 p-3 rounded text-sm">{{ payload }}</pre>
      </div>
    </div>

    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
const token = ref("");
const header = ref("");
const payload = ref("");
const error = ref("");

watch(token, (val) => {
  header.value = "";
  payload.value = "";
  error.value = "";

  if (!val.includes(".")) return;

  try {
    const parts = val.split(".");
    header.value = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
    payload.value = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
  } catch (e) {
    error.value = "❌ 无法解析 Token";
  }
});
</script>
