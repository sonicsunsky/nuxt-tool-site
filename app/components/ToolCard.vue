<template>
  <NuxtLink
    :to="tool.path"
    class="border border-gray-200 p-4 rounded-xl hover:shadow transition"
  >
    <h3 class="font-semibold text-lg mb-2">{{ tool.name }}</h3>
    <p class="text-gray-500 text-sm">{{ tool.desc }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ tool: { name: string; path: string; desc: string } }>();
</script>
