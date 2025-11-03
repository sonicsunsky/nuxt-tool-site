<template>
  <div>
    <h2 class="text-lg font-bold mb-4">图标库浏览</h2>

    <UInput
      v-model="keyword"
      placeholder="搜索图标关键字（如 home, user, arrow）"
      class="w-full p-2 rounded mb-4"
    />

    <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4">
      <div
        v-for="name in filteredIcons"
        :key="name"
        class="flex flex-col items-center justify-center border p-3 rounded hover:bg-gray-100 cursor-pointer"
        @click="copy(name)"
      >
        <Icon :name="`lucide:${name}`" size="24" />
        <p class="text-xs mt-1">{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { icons } from "@iconify-json/lucide";
// import { useToolSeo } from "~/utils/useToolSeo";
// useToolSeo();

const lucideIcons = ref([]);
// 获取所有图标名称
const iconNames = Object.keys(icons.icons);
lucideIcons.value = iconNames;

const keyword = ref("");

const filteredIcons = computed(() =>
  lucideIcons.value.filter((i) =>
    i.toLowerCase().includes(keyword.value.toLowerCase())
  )
);

function copy(name: string) {
  navigator.clipboard.writeText(`<Icon icon="lucide:${name}" />`);
  alert(`已复制: ${name}`);
}
</script>
