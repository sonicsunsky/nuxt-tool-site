<template>
  <UContainer class="py-10 max-w-3xl">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        IP 地址查询工具
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        查看您的 IP 位置，或查询任意域名/IP 的归属地
      </p>
    </div>

    <ClientOnly>
      <template #fallback>
        <UCard class="mb-8" :ui="{ body: { padding: 'p-6 sm:p-8' } }">
          <div class="flex justify-center py-4">
            <UIcon
              name="i-heroicons-arrow-path"
              class="animate-spin w-8 h-8 text-primary-500"
            />
          </div>
        </UCard>
      </template>

      <UCard class="mb-8" :ui="{ body: { padding: 'p-6 sm:p-8' } }">
        <div v-if="currentUserLoading" class="flex justify-center py-4">
          <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin w-8 h-8 text-primary-500"
          />
        </div>

        <div v-else class="text-center">
          <p class="text-sm text-gray-500 uppercase tracking-wider mb-1">
            您当前的 IP 地址是
          </p>
          <h2
            class="text-4xl font-mono font-bold text-primary-600 dark:text-primary-400 mb-2"
          >
            {{ currentUserData?.ip || "未知" }}
          </h2>
          <p class="text-xl text-gray-800 dark:text-gray-200">
            <UIcon name="i-heroicons-map-pin" class="align-middle mr-1 -mt-1" />
            来自：{{ currentUserData?.location || "未知区域" }}
          </p>
          <UBadge
            v-if="currentUserData?.isp"
            color="neutral"
            variant="soft"
            class="mt-3"
          >
            {{ currentUserData?.isp }}
          </UBadge>
        </div>
      </UCard>
    </ClientOnly>

    <div class="relative py-8">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="bg-white dark:bg-gray-900 px-3 text-sm text-gray-500"
          >查询其他</span
        >
      </div>
    </div>

    <div class="flex gap-2 mb-6">
      <UInput
        v-model="searchInput"
        icon="i-heroicons-magnifying-glass"
        placeholder="请输入 IP (如 1.1.1.1) 或域名 (如 baidu.com)"
        class="flex-1"
        size="lg"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        @keyup.enter="handleSearch"
      >
        <template #trailing>
          <UButton
            v-if="searchInput"
            color="neutral"
            variant="link"
            icon="i-heroicons-x-mark"
            :padded="false"
            @click="searchInput = ''"
          />
        </template>
      </UInput>

      <UButton
        label="查询"
        size="lg"
        color="primary"
        :loading="searchLoading"
        @click="handleSearch"
      />
    </div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <UCard v-if="searchResult" class="border-primary-500/50 border">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-lg">查询结果</h3>
            <UBadge
              :color="searchResult.error ? 'error' : 'success'"
              variant="subtle"
            >
              {{ searchResult.error ? "错误" : "成功" }}
            </UBadge>
          </div>
        </template>

        <div
          v-if="searchResult.error"
          class="text-red-500 flex items-center gap-2"
        >
          <UIcon name="i-heroicons-exclamation-circle" />
          {{ searchResult.error }}
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <span class="text-gray-500 text-xs uppercase">IP 地址</span>
            <div class="font-mono text-lg font-bold">{{ searchResult.ip }}</div>
          </div>
          <div class="space-y-1">
            <span class="text-gray-500 text-xs uppercase">地理位置</span>
            <div class="text-lg">{{ searchResult.location }}</div>
          </div>
          <div class="space-y-1 sm:col-span-2">
            <span class="text-gray-500 text-xs uppercase">运营商 / ISP</span>
            <div class="text-lg">{{ searchResult.isp }}</div>
          </div>
        </div>
      </UCard>
    </transition>
  </UContainer>
</template>

<script setup lang="ts">
// 页面元数据
useHead({
  title: "IP查询 - 在线开发者工具箱",
  meta: [
    { name: "description", content: "查看本机IP，查询IP地理位置和域名解析IP" },
  ],
});

// 状态定义
const searchInput = ref("");
const searchResult = ref<any>(null);
const searchLoading = ref(false);

// 1. 获取当前用户 IP
// 使用 useFetch 配合 server: false 时，必须确保由 ClientOnly 包裹或在 onMounted 中处理
const { data: currentUserData, pending: currentUserLoading } = await useFetch(
  "/api/ip",
  {
    key: "current-user-ip",
    server: false, // 仅在客户端发起请求
    lazy: true, // 不阻塞路由导航
  }
);

// 2. 处理搜索逻辑
const handleSearch = async () => {
  if (!searchInput.value.trim()) return;

  searchLoading.value = true;
  searchResult.value = null;

  try {
    const data = await $fetch("/api/ip", {
      params: { target: searchInput.value },
    });
    searchResult.value = data;
  } catch (err) {
    searchResult.value = { error: "网络请求失败，请稍后重试" };
  } finally {
    searchLoading.value = false;
  }
};
</script>
