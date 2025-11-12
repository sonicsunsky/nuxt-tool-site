<template>
  <div>
    <h2 class="text-lg font-bold mb-4">Mock 数据生成工具</h2>

    <!-- 工具介绍 -->
    <section
      class="mt-8 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">什么是 Mock 数据？</h3>
      <p>
        Mock 数据常用于前端开发、接口调试与测试阶段，用于模拟后端接口返回值。
        本工具可快速生成随机姓名、手机号、邮箱、地址、日期等多类型字段数据，
        帮助开发者高效构建测试场景。
      </p>
      <p class="mt-2 text-sm text-gray-500">
        ⚙️ 所有生成逻辑均在本地完成，不上传任何数据。
      </p>
    </section>

    <!-- 控制区 -->
    <div class="flex items-center justify-between gap-2 my-6">
      <div>
        <label class="font-medium mr-4">生成条数</label>
        <UInput
          v-model.number="count"
          type="number"
          min="1"
          max="100"
          class="w-32"
        />
      </div>

      <div>
        <label class="font-medium mr-4">字段类型</label>
        <USelect
          v-model="selectedFields"
          multiple
          :items="fieldOptions"
          placeholder="选择字段类型"
        />
      </div>

      <div>
        <UButton color="primary" size="xl" @click="generate">
          生成数据
        </UButton>
      </div>
    </div>

    <!-- 输出区 -->
    <div class="relative">
      <UButton
        v-if="result"
        size="sm"
        variant="soft"
        color="primary"
        class="absolute top-2 right-6 z-10"
        @click="copyResult"
      >
        复制结果
      </UButton>

      <pre
        class="bg-gray-100 p-4 rounded text-sm overflow-auto h-96 font-mono"
        >{{ result }}</pre
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { fakerZH_CN as faker } from "@faker-js/faker";
const toast = useToast();

const count = ref(10);
const locale = ref("zh");
const selectedFields = ref(["name", "email", "phone"]);

const result = ref("");

// 字段类型选项
const fieldOptions = [
  { label: "姓名", value: "name" },
  { label: "邮箱", value: "email" },
  { label: "手机号", value: "phone" },
  { label: "地址", value: "address" },
  { label: "城市", value: "city" },
  { label: "日期", value: "date" },
  { label: "公司", value: "company" },
  { label: "网址", value: "url" },
];

/** ✅ 生成随机 Mock 数据 */
function generate() {
  const data = Array.from({ length: count.value }).map(() => {
    const obj: Record<string, string> = {};

    selectedFields.value.forEach((field) => {
      switch (field) {
        case "name":
          obj.name = faker.person.fullName();
          break;
        case "email":
          obj.email = faker.internet.email();
          break;
        case "phone":
          obj.phone = faker.phone.number();
          break;
        case "address":
          obj.address = faker.location.streetAddress();
          break;
        case "city":
          obj.city = faker.location.city();
          break;
        case "date":
          obj.date = faker.date.recent().toISOString().split("T")[0];
          break;
        case "company":
          obj.company = faker.company.name();
          break;
        case "url":
          obj.url = faker.internet.url();
          break;
      }
    });

    return obj;
  });

  result.value = JSON.stringify(data, null, 2);

  toast.add({
    title: "✅ 数据生成成功",
    description: `已生成 ${count.value} 条记录`,
    color: "success",
  });
}

/** ✅ 一键复制结果 */
function copyResult() {
  if (!result.value) return;
  navigator.clipboard.writeText(result.value);
  toast.add({
    title: "复制成功 ✅",
    description: "Mock 数据已复制到剪贴板",
    color: "success",
  });
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
