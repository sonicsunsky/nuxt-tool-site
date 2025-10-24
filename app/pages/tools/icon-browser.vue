<template>
  <div>
    <h2 class="text-lg font-bold mb-4">图标库浏览</h2>

    <input
      v-model="keyword"
      placeholder="搜索图标关键字（如 home, user, arrow）"
      class="w-full border p-2 rounded mb-4"
    />

    <div class="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
      <div
        v-for="name in filteredIcons"
        :key="name"
        class="flex flex-col items-center justify-center border p-3 rounded hover:bg-gray-100 cursor-pointer"
        @click="copy(name)"
      >
        <Icon :icon="`lucide:${name}`" width="24" height="24" />
        <p class="text-xs mt-1">{{ name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const keyword = ref("");
const icons = [
  "home",
  "user",
  "settings",
  "search",
  "bell",
  "star",
  "heart",
  "arrow-right",
  "edit",
  "trash",
  "check",
  "x",
  "menu",
  "camera",
  "lock",
  "cloud",
  "folder",
  "download",
  "upload",
];

const filteredIcons = computed(() =>
  icons.filter((i) => i.toLowerCase().includes(keyword.value.toLowerCase()))
);

function copy(name: string) {
  navigator.clipboard.writeText(`<Icon icon="lucide:${name}" />`);
  alert(`已复制: ${name}`);
}
</script>
