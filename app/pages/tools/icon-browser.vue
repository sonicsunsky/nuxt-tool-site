<template>
  <div class="tool-container">
    <h1 class="tool-title">🎨 在线图标库浏览器</h1>
    <p class="tool-desc">
      支持 Lucide 图标库在线搜索、浏览与复制，用于快速搭建前端 UI 页面。
    </p>

    <!-- ✅ SEO 内容说明 -->
    <section class="info-block">
      <h3 class="info-title">图标在线预览使用指南</h3>
      <p>
        本工具支持快速搜索常用 UI 图标，一键复制图标名称，可直接用于
        <strong>Vue、Nuxt、前端组件库项目</strong
        >中，适合设计师与前端工程师提升开发效率。
      </p>
      <p class="mt-2">✅ 支持关键词检索 ✅ 支持点击复制 ✅ 支持响应式布局</p>
    </section>

    <!-- 搜索栏 -->
    <UInput
      v-model="keyword"
      placeholder="搜索图标关键字（例如：home, user, arrow）"
      class="search-input w-1/2"
      icon="i-heroicons-magnifying-glass-20-solid"
    />

    <!-- 没有搜索结果时提示 -->
    <p v-if="filteredIcons.length === 0" class="no-data">
      😅 未找到相关图标，请尝试其他关键字
    </p>

    <!-- 图标列表 -->
    <div class="icon-grid">
      <div
        v-for="name in paginatedIcons"
        :key="name"
        class="icon-card"
        @click="copy(name)"
      >
        <Icon :name="`lucide:${name}`" size="24" />
        <p class="icon-name">{{ name }}</p>
      </div>
    </div>

    <!-- 分页器 -->
    <UPagination
      v-if="totalPages > 1"
      v-model:page="page"
      :total="filteredIcons.length"
      :page-size="pageSize"
      class="mt-6"
    />
  </div>
</template>

<script setup lang="ts">
import { icons } from "@iconify-json/lucide";
import { useToast } from "#imports";

const toast = useToast();
const pageSize = 90; // ✅分页，防止几千图标导致卡顿

// 图标列表加载
const iconNames = Object.keys(icons.icons);
const lucideIcons = ref(iconNames);

const keyword = ref("");
const page = ref(1);

const filteredIcons = computed(() =>
  lucideIcons.value.filter((i) =>
    i.toLowerCase().includes(keyword.value.toLowerCase())
  )
);

// 🎯当前页图标
const paginatedIcons = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredIcons.value.slice(start, start + pageSize);
});

// ✅总页数
const totalPages = computed(() =>
  Math.ceil(filteredIcons.value.length / pageSize)
);

// ✅复制图标
function copy(name: string) {
  navigator.clipboard.writeText(`<Icon name="lucide:${name}" />`);
  toast.add({
    title: "复制成功 ✅",
    description: `${name} 已复制到剪贴板`,
    timeout: 2000,
  });
}
</script>

<style scoped>
.tool-container {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
}

.tool-title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
}

.tool-desc {
  text-align: center;
  color: #555;
  margin-bottom: 1.5rem;
}

.info-block {
  margin-top: 1rem;
  padding: 1.2rem;
  background: #f8fafc;
  border-radius: 12px;
  line-height: 1.7;
}

.search-input {
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
}

.no-data {
  text-align: center;
  color: #aaa;
  margin-top: 1.5rem;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
  gap: 14px;
}

.icon-card {
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
}

.icon-card:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.icon-name {
  font-size: 0.75rem;
  margin-top: 6px;
  color: #555;
}
</style>
