<template>
  <div>
    <h2 class="text-lg font-bold mb-4">UUID 生成</h2>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">UUID 生成工具介绍</h3>
      <p>
        UUID（通用唯一识别码）用于唯一标识信息，如设备 ID、请求 ID 等。
        本工具可一键生成多个
        UUID，支持格式去除连字符，用于数据库主键或随机标识创建。
      </p>
    </section>

    <div class="flex gap-3">
      <UButton
        color="primary"
        size="xl"
        @click="generate"
        class="px-4 py-2 rounded"
      >
        生成 UUID
      </UButton>

      <UButton
        color="neutral"
        size="xl"
        @click="copy"
        class="px-4 py-2 rounded"
      >
        复制
      </UButton>
    </div>

    <pre class="bg-gray-100 p-4 mt-4 rounded text-sm">{{ uuid }}</pre>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <UButton
        color="neutral"
        size="xl"
        variant="outline"
        v-for="i in 5"
        :key="i"
        @click="generateBatch(i)"
        class="border p-2 rounded"
      >
        批量生成 {{ i * 10 }} 个
      </UButton>
    </div>

    <pre
      v-if="batchList.length"
      class="bg-gray-50 p-3 mt-3 text-xs h-60 overflow-auto"
      >{{ batchList.join("\n") }}
</pre
    >
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

const uuid = ref("");
const batchList = ref<string[]>([]);

function generate() {
  uuid.value = uuidv4();
}
function copy() {
  navigator.clipboard.writeText(uuid.value);
}
function generateBatch(i: number) {
  batchList.value = Array.from({ length: i * 10 }, () => uuidv4());
}
</script>
