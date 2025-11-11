<template>
  <div class="tool-container">
    <h1 class="tool-title">🔗 URL 编解码工具</h1>
    <p class="tool-desc">支持 encodeURIComponent / decodeURIComponent 编解码</p>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">URL 编码与解码介绍</h3>
      <p>
        URL 编码用于将特殊字符转换为安全格式，以便在网络传输中不丢失信息。
        本工具支持对文本进行编码与解码，常用于链接参数处理与 Web 开发场景。
      </p>
    </section>

    <UTextarea
      v-model="input"
      placeholder="请输入要编码或解码的内容..."
      class="url-input"
    ></UTextarea>

    <div class="actions">
      <UButton color="secondary" size="xl" @click="encode" class="btn">
        编码 (Encode)
      </UButton>

      <UButton color="secondary" size="xl" @click="decode" class="btn">
        解码 (Decode)
      </UButton>

      <UButton
        color="neutral"
        variant="soft"
        size="xl"
        @click="reset"
        class="btn secondary"
      >
        清空
      </UButton>
    </div>

    <div v-if="result" class="result-area">
      <h3>结果</h3>
      <div class="result-box">
        <pre>{{ result }}</pre>
        <UButton color="info" size="sm" class="copy-btn" @click="copy(result)">
          复制
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const input = ref("");
const result = ref("");

function encode() {
  try {
    result.value = encodeURIComponent(input.value);
  } catch (e) {
    result.value = "编码错误：" + (e as Error).message;
  }
}

function decode() {
  try {
    result.value = decodeURIComponent(input.value);
  } catch (e) {
    result.value = "解码错误：" + (e as Error).message;
  }
}

function reset() {
  input.value = "";
  result.value = "";
}

function copy(text: string) {
  navigator.clipboard.writeText(text);
  alert("已复制到剪贴板！");
}
</script>

<style scoped>
.tool-container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  text-align: center;
}

.tool-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.tool-desc {
  color: #666;
  margin-bottom: 1.5rem;
}

.url-input {
  width: 100%;
  min-height: 160px;
  padding: 0.8rem;
  font-family: monospace;
  border-radius: 8px;
  resize: vertical;
}

.actions {
  margin: 1.2rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* .btn:hover {
  background: #1e40af;
}

.btn.secondary {
  background: #f3f4f6;
  color: #333;
} */

.result-area {
  text-align: left;
  margin-top: 1rem;
}

.result-box {
  position: relative;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  font-family: monospace;
  overflow-x: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-btn {
  /* position: absolute;
  top: 0.6rem;
  right: 0.6rem; */
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
