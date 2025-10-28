<template>
  <div class="tool-container">
    <h1 class="tool-title">🆚 在线文本对比工具</h1>
    <p class="tool-desc">快速比较两段文本的差异，支持高亮显示不同部分</p>

    <div class="diff-area">
      <div class="text-column">
        <h3>原始文本</h3>
        <textarea v-model="text1" placeholder="输入第一段文本..." />
      </div>

      <div class="text-column">
        <h3>对比文本</h3>
        <textarea v-model="text2" placeholder="输入第二段文本..." />
      </div>
    </div>

    <div class="actions">
      <button class="btn" @click="doDiff">开始对比</button>
      <button class="btn secondary" @click="reset">清空</button>
    </div>

    <div v-if="diffHtml" class="diff-result" v-html="diffHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as Diff from "diff";

const text1 = ref("");
const text2 = ref("");
const diffHtml = ref("");

function doDiff() {
  const diff = Diff.diffWords(text1.value, text2.value);
  diffHtml.value = diff
    .map((part) => {
      const color = part.added
        ? "#22c55e33"
        : part.removed
        ? "#ef444433"
        : "transparent";
      const mark = part.added ? "+ " : part.removed ? "- " : "";
      return `<span style="background:${color};">${mark}${part.value}</span>`;
    })
    .join("");
}

function reset() {
  text1.value = "";
  text2.value = "";
  diffHtml.value = "";
}
</script>

<style scoped>
.tool-container {
  max-width: 1000px;
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

.diff-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
}

.text-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

textarea {
  min-height: 180px;
  width: 100%;
  resize: vertical;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: monospace;
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

.diff-result {
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  font-family: monospace;
  text-align: left;
  overflow-x: auto;
}
</style>
