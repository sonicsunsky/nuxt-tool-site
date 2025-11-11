<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

function getVisitorId() {
  const key = "analytics_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function sendAnalytics(path?: string) {
  const route = useRoute();
  const body = {
    path: path || route.fullPath,
    referrer: document.referrer || null,
    visitorId: getVisitorId(),
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    ts: new Date().toISOString(),
  };

  // ✅ 更推荐 fetch + keepalive，用于页面卸载时继续发送
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

const router = useRouter();

onMounted(() => {
  // 首次进入
  sendAnalytics();

  // SPA 模式路由切换也统计
  router.afterEach((to) => {
    sendAnalytics(to.fullPath);
  });

  // 页面关闭/切换标签页时尽量上报
  const handleUnload = () => sendAnalytics();
  window.addEventListener("beforeunload", handleUnload);

  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", handleUnload);
  });
});
</script>

<template>
  <div></div>
</template>
