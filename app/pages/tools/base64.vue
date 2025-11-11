<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-center mb-4">Base64 编解码工具</h1>
    <p class="text-gray-600 text-center mb-10">
      支持在线 Base64 字符串实时编码/解码，可处理多行文本和文件内容。
    </p>

    <!-- 功能介绍 -->
    <section
      class="p-6 mb-10 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 leading-relaxed"
    >
      <h2 class="text-xl font-semibold mb-2">工具介绍</h2>
      <p>
        Base64 是一种用于将二进制内容转换成文本格式的编码方式，常用于： 图片转
        DataURL、Token 传输、URL 安全携带等。
      </p>

      <h2 class="text-xl font-semibold mt-4 mb-2">如何使用？</h2>
      <ol class="list-disc ml-6 space-y-1">
        <li>输入或粘贴任何文本或 Base64 字符串</li>
        <li>点击「编码」或「解码」按钮</li>
        <li>可一键复制结果</li>
      </ol>
    </section>

    <UTextarea
      v-model="input"
      :rows="6"
      autoResize
      class="w-full rounded-lg"
      placeholder="请输入文本或 Base64 字符串..."
    />

    <div class="text-right mt-1 text-gray-500 text-sm">
      {{ input.length }} 字
    </div>

    <div class="mt-4 flex gap-2">
      <UButton color="primary" size="lg" @click="encode">
        🔐 编码 Base64
      </UButton>

      <UButton color="info" size="lg" @click="decode"> 🔓 解码 Base64 </UButton>

      <UButton color="neutral" variant="soft" size="lg" @click="clearInput">
        🧹 清空
      </UButton>
    </div>

    <div v-if="error" class="mt-3 text-red-600 text-sm">
      {{ error }}
    </div>

    <div v-if="output" class="mt-6 border rounded-lg bg-gray-100 p-4">
      <h3 class="font-semibold mb-2 flex justify-between items-center">
        输出结果
        <UButton variant="soft" size="sm" @click="copyOutput">
          📋 复制
        </UButton>
      </h3>
      <pre class="text-sm whitespace-pre-wrap break-all">{{ output }}</pre>
    </div>

    <p class="text-xs text-gray-400 mt-6 italic">
      ⚠️ 本工具完全在浏览器中运行，不会上传任何数据。
    </p>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const output = ref("");
const error = ref("");

function encode() {
  try {
    error.value = "";
    output.value = btoa(
      new TextEncoder()
        .encode(input.value)
        .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
  } catch (err) {
    error.value = "❌ 编码失败，请检查输入是否为有效文本";
  }
}

function decode() {
  try {
    error.value = "";
    const decoded = atob(input.value);
    output.value = new TextDecoder().decode(
      Uint8Array.from(decoded, (c) => c.charCodeAt(0))
    );
  } catch {
    error.value = "❌ 解码失败，请检查 Base64 内容是否正确";
  }
}

function clearInput() {
  input.value = "";
  output.value = "";
  error.value = "";
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value);
  alert("✅ 已复制到剪贴板!");
}
</script>
