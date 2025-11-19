// plugins/analytics.client.ts

// 定义获取或生成 visitorId 的函数
function getVisitorId(): string {
  const key = "analytics_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    // 使用 crypto.randomUUID() 确保唯一性
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

// 定义发送统计数据的核心函数
function sendAnalytics(path: string, isUnload = false) {
  // 确保在客户端执行
  if (typeof window === "undefined") {
    return;
  }

  const body = {
    path: path,
    referrer: document.referrer || null,
    visitorId: getVisitorId(),
    // 在客户端，可以直接访问这些全局对象
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    ts: new Date().toISOString(),
  };

  // 使用 fetch + keepalive，用于页面卸载时尽量上报
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // 页面卸载时使用 keepalive
    keepalive: isUnload,
    // 对于常规路由切换，keepalive 也可以使用，但主要针对 beforeunload
  }).catch(() => {});
}

export default defineNuxtPlugin((nuxtApp) => {
  // 获取 Nuxt 提供的路由实例
  const router = nuxtApp.$router;

  // 1. 首次进入页面统计 (使用 router.isReady 确保路由初始化完成)
  router.isReady().then(() => {
    // 首次加载页面时发送统计请求
    sendAnalytics(router.currentRoute.value.fullPath);
  });

  // 2. SPA 模式路由切换统计
  router.afterEach((to) => {
    // 每次路由切换完成后发送统计请求
    sendAnalytics(to.fullPath);
  });

  // 3. 页面关闭/切换标签页时尝试上报
  const handleUnload = () => {
    // 使用 isUnload=true 强制 keepalive
    sendAnalytics(router.currentRoute.value.fullPath, true);
  };

  // 仅在浏览器环境中添加监听器
  if (process.client) {
    window.addEventListener("beforeunload", handleUnload);

    // 可以在应用关闭时移除监听器，尽管对于全局插件来说不太必要，但保留习惯
    nuxtApp.hook("app:beforeUnmount", () => {
      window.removeEventListener("beforeunload", handleUnload);
    });
  }
});
