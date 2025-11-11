<template>
  <div class="tool-container">
    <h1 class="tool-title">🆚 在线文本对比工具</h1>
    <p class="tool-desc">
      快速比较两段文本差异并高亮显示不同内容，适用于代码审查、文档比对等场景。
    </p>

    <!-- SEO 内容说明 ✅ -->
    <section class="info-block">
      <h3 class="info-title">文本差异对比工具介绍</h3>
      <p>
        本工具支持对比两段文本差异并实时高亮：<strong>绿色表示新增</strong>、
        <strong>红色表示删除</strong>。常用于代码审查、配置比对、
        文档版本管理等工作，支持多语言文本对比。
      </p>

      <h4 class="mt-4 font-semibold">示例</h4>
      <pre class="example-code">
原文：Hello World!
对比：Hello GPT World!

✅ “GPT ”将会显示为新增内容（绿色）</pre
      >
    </section>

    <!-- 输入区域 -->
    <div class="diff-area">
      <div class="text-column">
        <h3>原始文本</h3>
        <UTextarea
          v-model="text1"
          :rows="12"
          autoresize
          class="w-1/2"
          placeholder="输入第一段文本..."
        />
      </div>

      <div class="text-column">
        <h3>对比文本</h3>
        <UTextarea
          v-model="text2"
          :rows="12"
          autoresize
          class="w-1/2"
          placeholder="输入第二段文本..."
        />
      </div>
    </div>

    <div class="actions">
      <UButton
        size="xl"
        color="primary"
        class="btn"
        :loading="isLoading"
        @click="doDiff"
      >
        开始对比
      </UButton>

      <UButton
        size="xl"
        color="neutral"
        variant="soft"
        class="btn"
        @click="reset"
      >
        清空
      </UButton>
    </div>

    <!-- Diff 结果 -->
    <div v-if="diffHtml" class="legend">
      <span class="added">绿色 = 新增</span>
      <span class="removed ml-4">红色 = 删除</span>
    </div>

    <div v-if="diffHtml" class="diff-result" v-html="diffHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { diffWordsWithSpace } from "diff";
import { escape } from "html-escaper";
import { nextTick } from "vue";

const text1 = ref("");
const text2 = ref("");
const diffHtml = ref("");
const isLoading = ref(false);

async function doDiff() {
  if (!text1.value && !text2.value) {
    diffHtml.value = "<i style='color:#999'>请先输入文本</i>";
    return;
  }

  isLoading.value = true;
  await nextTick();

  const diff = diffWordsWithSpace(text1.value, text2.value);

  diffHtml.value = diff
    .map((part) => {
      const val = escape(part.value);
      if (part.added) {
        return `<span class="added">+${val}</span>`;
      }
      if (part.removed) {
        return `<span class="removed">-${val}</span>`;
      }
      return `<span>${val}</span>`;
    })
    .join("");

  isLoading.value = false;
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
  color: #555;
  margin-bottom: 1.5rem;
}

/* ✅ SEO内容说明样式 */
.info-block {
  margin-top: 1.5rem;
  padding: 1.2rem;
  background: #f8fafc;
  border-radius: 12px;
  text-align: left;
  line-height: 1.7;
}
.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.example-code {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.8rem;
  font-family: monospace;
  font-size: 0.85rem;
  overflow-x: auto;
}

.diff-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1rem;
  margin-top: 1.4rem;
}
.text-column h3 {
  font-weight: 600;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.legend {
  margin-top: 1.2rem;
  font-size: 0.85rem;
}

.added {
}

.removed {
}

:deep(.added) {
  background-color: rgba(34, 197, 94, 0.4); /* 更醒目的绿色 */
  color: #065f46;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 1px;
  display: inline-block;
}

:deep(.removed) {
  background-color: rgba(239, 68, 68, 0.4); /* 更醒目的红色 */
  color: #991b1b;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 0 1px;
  display: inline-block;
}

.diff-result {
  text-align: left;
  font-family: monospace;
  background: #fafafa;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
