<script setup>
//请记住，app.vue 是你 Nuxt 应用的主组件。你添加到其中的任何内容（JS 和 CSS）都会是全局的，并包含在每个页面中
//当你的应用需要针对不同页面使用不同布局时，可以使用 app/layouts/ 目录并配合 <NuxtLayout> 组件。这允许你定义多个布局并按页面应用它们
//通过在你的 app.vue 中添加 <NuxtLayout> 来启用布局
//你也可以直接通过 <NuxtLayout> 的 name 属性覆盖所有页面的默认布局
/*
  definePageMeta({
  layout: 'custom',
})
  */
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
  script: [
    {
      async: true,
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8225014244650570",
      crossorigin: "anonymous",
    },
  ],
});

const title = "Nuxt Starter Template";
const description =
  "A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
