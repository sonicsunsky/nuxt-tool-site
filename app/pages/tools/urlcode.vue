<template>
  <div class="tool-container">
    <h1 class="tool-title">🔗 URL 编解码工具</h1>
    <p class="tool-desc">支持 encodeURIComponent / decodeURIComponent 编解码</p>

    <textarea
      v-model="input"
      placeholder="请输入要编码或解码的内容..."
      class="url-input"
    ></textarea>

    <div class="actions">
      <button class="btn" @click="encode">编码 (Encode)</button>
      <button class="btn" @click="decode">解码 (Decode)</button>
      <button class="btn secondary" @click="reset">清空</button>
    </div>

    <div v-if="result" class="result-area">
      <h3>结果</h3>
      <div class="result-box">
        <pre>{{ result }}</pre>
        <button class="copy-btn" @click="copy(result)">复制</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

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
  border: 1px solid #ddd;
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
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #1e40af;
}

.btn.secondary {
  background: #f3f4f6;
  color: #333;
}

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
}

.copy-btn {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
