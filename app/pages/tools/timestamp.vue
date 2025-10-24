<template>
  <div>
    <h2 class="text-lg font-bold mb-4">时间戳 ↔ 日期转换</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="font-medium">时间戳（秒）</label>
        <input
          v-model="timestamp"
          type="number"
          class="w-full border p-2 rounded mt-1"
          placeholder="例如：1735056000"
        />
        <button
          @click="toDate"
          class="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
        >
          转为日期
        </button>
      </div>

      <div>
        <label class="font-medium">日期</label>
        <input
          v-model="dateStr"
          type="datetime-local"
          class="w-full border p-2 rounded mt-1"
        />
        <button
          @click="toTimestamp"
          class="bg-gray-600 text-white px-4 py-2 mt-3 rounded"
        >
          转为时间戳
        </button>
      </div>
    </div>

    <div class="mt-6 bg-gray-100 p-4 rounded text-sm">
      <p>当前时间戳（秒）: {{ nowTs }}</p>
      <p>当前时间: {{ new Date().toLocaleString() }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const timestamp = ref("");
const dateStr = ref("");
const nowTs = computed(() => Math.floor(Date.now() / 1000));

function toDate() {
  if (!timestamp.value) return;
  dateStr.value = new Date(Number(timestamp.value) * 1000)
    .toISOString()
    .slice(0, 16);
}

function toTimestamp() {
  if (!dateStr.value) return;
  timestamp.value = Math.floor(
    new Date(dateStr.value).getTime() / 1000
  ).toString();
}
</script>
