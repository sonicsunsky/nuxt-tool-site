<template>
  <div>
    <h2 class="text-lg font-bold mb-4">正则表达式测试工具</h2>

    <!-- 说明 -->
    <section
      class="mt-8 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">正则表达式测试工具简介</h3>
      <p>
        实时测试正则（支持 g / i /
        m），输入表达式与文本后会显示高亮匹配与匹配数量。
      </p>
    </section>

    <!-- 输入区 -->
    <div class="mt-6 space-y-3">
      <div class="flex items-center gap-2">
        <UInput
          v-model="patternInput"
          placeholder="输入正则表达式，如：\\d+"
          class="flex-1"
        />
        <label class="flex items-center gap-1 text-sm text-gray-600"
          ><UCheckbox v-model="flags.g" /> g</label
        >
        <label class="flex items-center gap-1 text-sm text-gray-600"
          ><UCheckbox v-model="flags.i" /> i</label
        >
        <label class="flex items-center gap-1 text-sm text-gray-600"
          ><UCheckbox v-model="flags.m" /> m</label
        >
      </div>

      <div class="flex flex-wrap gap-2 text-sm">
        <UButton
          v-for="item in templates"
          :key="item.label"
          color="neutral"
          variant="outline"
          size="xs"
          @click="insertTemplate(item.value)"
        >
          {{ item.label }}
        </UButton>
      </div>

      <UTextarea
        v-model="text"
        :rows="6"
        class="w-full p-2 rounded"
        placeholder="输入要匹配的文本..."
      />
    </div>

    <!-- 结果区 -->
    <div class="mt-4">
      <div class="flex justify-between text-sm mb-2 text-gray-600">
        <span v-if="regexError" class="text-red-600">❌ {{ regexError }}</span>
        <span v-else-if="matchCount">✅ 共匹配 {{ matchCount }} 处</span>
        <span v-else class="text-gray-400">无匹配</span>
      </div>

      <div
        v-html="highlightedHtml"
        class="bg-white border rounded p-3 whitespace-pre-wrap text-sm leading-relaxed"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const patternInput = ref("");
const text = ref("");
const flags = reactive({ g: true, i: false, m: false });

const regex = ref<RegExp | null>(null);
const regexError = ref("");

// 本地防抖：只在用户停止输入后（300ms）才编译正则，避免卡顿
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleUpdateRegex() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateRegexNow();
    debounceTimer = null;
  }, 300);
}

function getFlagString() {
  return Object.keys(flags)
    .filter((k) => (flags as any)[k])
    .join("");
}

function updateRegexNow() {
  if (!patternInput.value) {
    regex.value = null;
    regexError.value = "";
    return;
  }
  try {
    const flagStr = getFlagString();
    regex.value = new RegExp(patternInput.value, flagStr);
    regexError.value = "";
  } catch (err) {
    regex.value = null;
    regexError.value = (err as Error).message || "正则语法错误";
  }
}

// 当 patternInput 或 flags 改变时防抖编译
watch(
  [patternInput, () => flags.g, () => flags.i, () => flags.m],
  () => {
    scheduleUpdateRegex();
  },
  { deep: true }
);

// escape HTML 防 XSS（简单实现）
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 从 regex 与 text 构建高亮 HTML（安全：对非匹配段与匹配内容都做了 escape）
const highlightedHtml = computed(() => {
  const src = text.value || "";
  if (!src) return "";
  if (!regex.value) {
    // 无正则或有语法错误：显示原文或错误
    if (regexError.value)
      return `<span class="text-red-600">❌ ${escapeHtml(
        regexError.value
      )}</span>`;
    return escapeHtml(src);
  }

  // 使用非破坏式方式构建高亮：按 exec 遍历匹配，拼接转义后的片段
  try {
    const r = regex.value;
    // 确保从头开始
    r.lastIndex = 0;
    let lastIndex = 0;
    let html = "";
    let m: RegExpExecArray | null;

    // 如果没有全局标志，exec 仍然返回第一个匹配；但我们 want to highlight first or all depending on g flag
    while ((m = r.exec(src)) !== null) {
      const idx = m.index;
      // 非匹配片段转义后追加
      html += escapeHtml(src.slice(lastIndex, idx));
      // 匹配片段转义并加 mark
      html += `<mark class="bg-yellow-200 text-black rounded px-0.5">${escapeHtml(
        m[0]
      )}</mark>`;
      lastIndex = r.lastIndex;
      // 避免无限循环：当匹配空串时防止死循环
      if (m[0].length === 0) {
        r.lastIndex++;
      }
      // 如果不是全局模式，break（只高亮第一个）
      if (!flags.g) break;
    }
    // 追加尾部
    html += escapeHtml(src.slice(lastIndex));
    return html || '<span class="text-gray-400">无匹配结果</span>';
  } catch (e) {
    return `<span class="text-red-600">❌ ${(e as Error).message}</span>`;
  }
});

// match count 计算（遍历 exec）
const matchCount = computed(() => {
  if (!regex.value) return 0;
  const r = regex.value;
  r.lastIndex = 0;
  let cnt = 0;
  let m: RegExpExecArray | null;
  while ((m = r.exec(text.value || "")) !== null) {
    cnt++;
    if (m[0].length === 0) {
      r.lastIndex++;
    }
    if (!flags.g) break;
  }
  return cnt;
});

// 常用模板
const templates = ref([
  { label: "邮箱", value: "^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$" },
  { label: "手机号(中国)", value: "^1[3-9]\\d{9}$" },
  {
    label: "URL",
    value: "https?://[\\w.-]+(?:\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=.]+)?",
  },
  { label: "邮政编码", value: "^\\d{6}$" },
  { label: "身份证号", value: "^(?:\\d{15}|\\d{17}[0-9Xx])$" },
  { label: "数字", value: "^\\d+$" },
  { label: "字母", value: "^[A-Za-z]+$" },
  { label: "含至少一个数字", value: "^(?=.*\\d).+$" },
]);

function insertTemplate(val: string) {
  patternInput.value = val;
  scheduleUpdateRegex(); // 立即 schedule 编译
}
</script>

<style scoped>
mark {
  background: #fef08a;
  color: #111827;
  border-radius: 2px;
  padding: 0 2px;
}
</style>
