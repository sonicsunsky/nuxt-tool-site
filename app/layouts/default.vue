<template>
  <div class="min-h-screen flex flex-col">
    <header
      class="p-6 max-w-6xl w-full mx-auto mb-6 flex items-center justify-between"
    >
      <h1 class="text-2xl font-bold">
        <NuxtLink to="/"> 🧰 开发者工具箱 </NuxtLink>
      </h1>
      <nav class="flex gap-4 text-blue-600">
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/tools/json-formatter">JSON格式化</NuxtLink>
        <NuxtLink to="/tools/base64">Base64</NuxtLink>
        <NuxtLink to="/tools/regex-tester">正则测试</NuxtLink>
      </nav>
    </header>

    <main
      class="flex-grow bg-white rounded-2xl shadow p-6 max-w-6xl w-full mx-auto"
    >
      <slot />
    </main>

    <Sponsors />

    <AnalyticsTracker />
  </div>
</template>

<style scoped>
a.router-link-active {
  font-weight: 600;
  text-decoration: underline;
}
</style>
