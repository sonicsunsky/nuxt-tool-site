<template>
  <button @click="contactForm">Contact</button>
</template>

<script setup lang="ts">
//在 Nuxt 中，$fetch 是发起 HTTP 调用的首选方式，替代为 Nuxt 2 设计的 @nuxt/http 和 @nuxtjs/axios。
async function contactForm() {
  await $fetch("/api/contact", {
    method: "POST",
    body: { hello: "world" },
  });
}
</script>
