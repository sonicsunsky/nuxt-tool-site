<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center">🆔 UUID 生成工具</h1>
    <p class="text-center text-gray-500">快速生成唯一标识符 UUID v4</p>

    <!-- 工具介绍 -->
    <section class="p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed">
      <h3 class="text-lg font-bold mb-2">UUID 生成工具介绍</h3>
      <p>
        UUID（通用唯一识别码）是一种标准的 128
        位标识符，用于唯一标识信息，如设备 ID、请求 ID 等。
        本工具支持单个或批量生成 UUID，并可选择是否去除连字符。
      </p>
    </section>

    <!-- 操作区 -->
    <div class="flex flex-wrap items-center gap-3">
      <UButton color="primary" size="lg" @click="generate">生成 UUID</UButton>

      <UButton color="neutral" variant="soft" size="lg" @click="copy">
        复制当前
      </UButton>

      <label class="flex items-center gap-2 text-sm text-gray-600">
        <UCheckbox v-model="noDash" /> 去除连字符
      </label>
    </div>

    <!-- 单个结果 -->
    <div v-if="uuid" class="mt-4">
      <h3 class="font-medium mb-1 text-gray-700">生成结果：</h3>
      <pre class="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">{{
        uuid
      }}</pre>
    </div>

    <!-- 批量生成 -->
    <div class="mt-8">
      <div class="flex flex-wrap items-center gap-3">
        <UInput
          v-model.number="batchCount"
          type="number"
          min="1"
          placeholder="生成数量（默认10）"
          class="w-40"
        />
        <UButton color="secondary" size="lg" @click="generateBatch">
          批量生成
        </UButton>
        <UButton
          v-if="batchList.length"
          color="info"
          variant="soft"
          size="lg"
          @click="copyBatch"
        >
          复制全部
        </UButton>
      </div>

      <div
        v-if="batchList.length"
        class="bg-gray-50 p-3 mt-4 rounded text-xs font-mono h-60 overflow-auto"
        ref="batchBox"
      >
        <pre>{{ batchList.join("\n") }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
const toast = useToast();

const uuid = ref("");
const batchList = ref<string[]>([]);
const noDash = ref(false);
const batchCount = ref<number>(10);
const batchBox = ref<HTMLDivElement | null>(null);

// 单个 UUID 生成
function generate() {
  let id = uuidv4();
  if (noDash.value) id = id.replace(/-/g, "");
  uuid.value = id;
  showToast("✅ 已生成 UUID");
}

// 批量生成
function generateBatch() {
  const count = batchCount.value > 0 ? batchCount.value : 10;
  batchList.value = Array.from({ length: count }, () => {
    let id = uuidv4();
    if (noDash.value) id = id.replace(/-/g, "");
    return id;
  });

  // 滚动到顶部以展示最新
  nextTick(() => {
    batchBox.value?.scrollTo({ top: 0, behavior: "smooth" });
  });
  showToast(`✅ 已生成 ${count} 个 UUID`);
}

// 复制单个
async function copy() {
  if (!uuid.value) return showToast("⚠️ 没有可复制的内容");
  await navigator.clipboard.writeText(uuid.value);
  showToast("📋 已复制当前 UUID");
}

// 复制批量
async function copyBatch() {
  if (!batchList.value.length) return showToast("⚠️ 没有内容可复制");
  await navigator.clipboard.writeText(batchList.value.join("\n"));
  showToast("📋 已复制所有 UUID");
}

// Toast 封装
function showToast(msg: string) {
  toast.add({
    title: msg,
    color: msg.includes("✅") ? "success" : "neutral",
  });
}
</script>
