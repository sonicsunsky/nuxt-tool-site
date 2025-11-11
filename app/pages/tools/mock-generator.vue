<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Mock 数据生成</h2>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">Mock 数据生成工具介绍</h3>
      <p>
        Mock 数据用于前端开发和接口调试，在后端未完成时提前模拟展示效果。
        本工具支持随机生成姓名、手机号、邮箱、地址等常用信息，加速开发进度。
      </p>
    </section>

    <div class="grid md:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="font-medium">生成条数</label>
        <UInput
          v-model.number="count"
          type="number"
          class="w-full p-2 rounded"
          :min="1"
          :max="100"
        />
      </div>

      <div>
        <label class="font-medium">字段数</label>
        <UInput
          v-model.number="fields"
          type="number"
          class="w-full p-2 rounded"
          :min="1"
          :max="10"
        />
      </div>

      <div>
        <UButton
          color="secondary"
          size="xl"
          @click="generate"
          class="px-4 py-2 rounded mt-6"
        >
          生成数据
        </UButton>
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
