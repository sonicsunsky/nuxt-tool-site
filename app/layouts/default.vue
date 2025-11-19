<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header
      class="p-4 max-w-6xl w-full mx-auto flex items-center justify-between"
    >
      <h1 class="text-3xl font-extrabold text-gray-900">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 hover:text-blue-600 transition"
        >
          <UIcon name="i-heroicons-wrench-screwdriver" class="text-blue-600" />
          开发者工具箱
        </NuxtLink>
      </h1>

      <nav class="hidden md:flex gap-6 items-center text-lg">
        <NuxtLink to="/" :class="linkClass">首页</NuxtLink>
        <NuxtLink to="/tools" :class="linkClass">全部工具</NuxtLink>

        <UDropdownMenu
          :items="toolDropdownItems"
          :popper="{ placement: 'bottom-end' }"
        >
          <UButton
            color="neutral"
            variant="outline"
            trailing-icon="i-heroicons-chevron-down"
            class="text-gray-700"
          >
            热门工具
          </UButton>
        </UDropdownMenu>

        <NuxtLink to="/about" :class="linkClass">关于我们</NuxtLink>
      </nav>

      <div class="flex items-center gap-2"></div>
    </header>

    <main
      class="flex-grow bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-6xl w-full mx-auto mb-8"
    >
      <slot />
    </main>

    <Sponsors />

    <footer
      class="mt-auto py-6 border-t bg-gray-100 text-center text-sm text-gray-600"
    >
      <div
        class="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center gap-y-2 md:gap-x-6"
      >
        <span>© {{ new Date().getFullYear() }} 开发者工具箱</span>

        <span class="hidden md:inline">|</span>
        <NuxtLink
          to="/privacy"
          class="text-blue-600 hover:text-blue-700 hover:underline transition"
          >隐私政策</NuxtLink
        >
        <NuxtLink
          to="/terms"
          class="text-blue-600 hover:text-blue-700 hover:underline transition"
          >使用条款</NuxtLink
        >
        <NuxtLink
          to="/contact"
          class="text-blue-600 hover:text-blue-700 hover:underline transition"
          >联系我们</NuxtLink
        >
        <span class="hidden md:inline">|</span>
        <a
          href="https://github.com/sonicsunsky/nuxt-tool-site"
          target="_blank"
          class="text-gray-700 hover:text-gray-900 transition"
        >
          <UIcon name="i-simple-icons-github" class="text-xl" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 获取路由信息用于判断链接是否激活
const route = useRoute();

// 导航链接的 Tailwind Class
// 使用函数来判断当前链接是否激活，动态添加样式
const linkClass = (path: string) => ({
  "text-blue-600 font-semibold border-b-2 border-blue-600": route.path === path,
  "text-gray-700 hover:text-blue-600 transition": route.path !== path,
});

// 下拉菜单数据 (用于热门工具，替代了 Header 中四个链接的硬编码)
const toolDropdownItems = ref([
  [
    {
      label: "JSON 格式化",
      icon: "i-heroicons-code-bracket",
      to: "/tools/json-formatter",
    },
    {
      label: "Base64 编解码",
      icon: "i-heroicons-lock-closed",
      to: "/tools/base64",
    },
    {
      label: "正则测试",
      icon: "i-heroicons-magnifying-glass",
      to: "/tools/regex-tester",
    },
    {
      label: "时间戳转换",
      icon: "i-heroicons-clock",
      to: "/tools/timestamp",
    },
  ],
]);

// 如果您使用了 @nuxt/color-mode 模块，可以取消以下代码注释
// const colorMode = useColorMode();
// const isDark = computed(() => colorMode.value === 'dark');
</script>

<style scoped>
/* 移除原有的 CSS 样式块，全部使用 Tailwind CSS class */
</style>
