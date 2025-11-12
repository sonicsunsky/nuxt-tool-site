<template>
  <div>
    <h2 class="text-lg font-bold mb-4">正则表达式测试工具</h2>

    <!-- 工具说明 -->
    <section
      class="mt-8 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">正则表达式测试工具介绍</h3>
      <p>
        这是一个实时测试正则表达式与文本匹配的工具。 支持 <b>全局 (g)</b>、<b
          >忽略大小写 (i)</b
        >、 <b>多行模式 (m)</b>，可快速验证表达式的正确性并查看高亮结果。
      </p>
    </section>

    <!-- 正则输入与模式 -->
    <div class="mt-6 space-y-3">
      <div class="flex items-center gap-2">
        <UInput
          v-model="pattern"
          placeholder="输入正则表达式，如：\\d+"
          class="flex-1"
        />
        <label class="flex items-center gap-1 text-sm text-gray-600">
          <UCheckbox v-model="flags.g" /> g
        </label>
        <label class="flex items-center gap-1 text-sm text-gray-600">
          <UCheckbox v-model="flags.i" /> i
        </label>
        <label class="flex items-center gap-1 text-sm text-gray-600">
          <UCheckbox v-model="flags.m" /> m
        </label>
      </div>

      <!-- 常用正则模板 -->
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

      <!-- 测试文本 -->
      <UTextarea
        v-model="text"
        :rows="6"
        class="w-full p-2 rounded"
        placeholder="输入要匹配的文本内容..."
      />
    </div>

    <!-- 匹配结果 -->
    <div class="mt-4">
      <div class="flex justify-between text-sm mb-2 text-gray-600">
        <span v-if="regexError" class="text-red-600">❌ {{ regexError }}</span>
        <span v-else-if="matchCount">共匹配 {{ matchCount }} 处</span>
        <span v-else class="text-gray-400">无匹配</span>
      </div>

      <div
        v-html="highlighted"
        class="bg-white border rounded p-3 whitespace-pre-wrap text-sm leading-relaxed"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const pattern = ref("");
const text = ref("");
const flags = reactive({ g: true, i: false, m: false });

const regex = ref<RegExp | null>(null);
const regexError = ref<string>("");

// ✅ 防抖更新正则，避免输入卡顿
const updateRegex = useDebounceFn(() => {
  try {
    if (!pattern.value) {
      regex.value = null;
      regexError.value = "";
      return;
    }
    const flagStr = Object.keys(flags)
      .filter((k) => (flags as any)[k])
      .join("");
    regex.value = new RegExp(pattern.value, flagStr);
    regexError.value = "";
  } catch (err) {
    regex.value = null;
    regexError.value = (err as Error).message;
  }
}, 300);

watch([pattern, flags], updateRegex, { deep: true });

// ✅ 匹配与高亮
const matches = computed(() => {
  if (!regex.value) return [];
  return [...text.value.matchAll(regex.value)].map((m) => m[0]);
});
const matchCount = computed(() => matches.value.length);

const highlighted = computed(() => {
  if (!text.value) return "";
  if (!regex.value) {
    if (regexError.value)
      return `<span class="text-red-600">❌ ${regexError.value}</span>`;
    return text.value;
  }
  return text.value.replace(regex.value, (m) => {
    return `<mark class="bg-yellow-200 text-black rounded px-0.5">${m}</mark>`;
  });
});

// ✅ 常用正则模板
const templates = ref([
  { label: "邮箱", value: "^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$" },
  { label: "手机号(中国)", value: "^1[3-9]\\d{9}$" },
  {
    label: "URL",
    value: "https?://[\\w.-]+(?:\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=.]+)?",
  },
  { label: "邮政编码", value: "^\\d{6}$" },
  { label: "身份证号", value: "^\\d{15}|\\d{18}$" },
  { label: "数字", value: "^\\d+$" },
  { label: "字母", value: "^[A-Za-z]+$" },
  { label: "含至少一个数字", value: "^(?=.*\\d).+$" },
]);

function insertTemplate(val: string) {
  pattern.value = val;
}
</script>

<style scoped>
mark {
  background: #fef08a;
  color: #111827;
}
</style>
