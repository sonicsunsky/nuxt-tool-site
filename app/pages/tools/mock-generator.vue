<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Mock 数据生成</h2>

    <div class="grid md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="font-medium">生成条数</label>
        <input
          v-model.number="count"
          type="number"
          class="w-full border p-2 rounded mt-1"
          min="1"
          max="100"
        />
      </div>
      <div>
        <label class="font-medium">字段数</label>
        <input
          v-model.number="fields"
          type="number"
          class="w-full border p-2 rounded mt-1"
          min="1"
          max="10"
        />
      </div>
      <div>
        <button
          @click="generate"
          class="bg-blue-600 text-white px-4 py-2 mt-6 rounded w-full"
        >
          生成数据
        </button>
      </div>
    </div>

    <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto h-80">{{
      result
    }}</pre>
  </div>
</template>

<script setup lang="ts">
const count = ref(5);
const fields = ref(3);
const result = ref("");

function randomStr() {
  return Math.random().toString(36).substring(2, 8);
}

function generate() {
  const data = Array.from({ length: count.value }).map(() => {
    const obj: Record<string, string | number> = {};
    for (let i = 0; i < fields.value; i++) {
      obj[`field${i + 1}`] = randomStr();
    }
    return obj;
  });
  result.value = JSON.stringify(data, null, 2);
}
</script>
