<template>
  <div>
    <h2 class="text-lg font-bold mb-4">UUID 生成</h2>

    <div class="flex gap-3">
      <button
        @click="generate"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        生成 UUID
      </button>
      <button @click="copy" class="bg-gray-600 text-white px-4 py-2 rounded">
        复制
      </button>
    </div>

    <pre class="bg-gray-100 p-4 mt-4 rounded text-sm">{{ uuid }}</pre>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        v-for="i in 5"
        :key="i"
        @click="generateBatch(i)"
        class="border p-2 rounded hover:bg-gray-100"
      >
        批量生成 {{ i * 10 }} 个
      </button>
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
