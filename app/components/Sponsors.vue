<template>
  <footer
    class="border-t border-gray-200 py-6 mt-auto text-center text-gray-600 bg-gray-50"
  >
    <div class="flex flex-col items-center gap-4 max-w-5xl mx-auto">
      <h3 class="text-lg font-semibold text-gray-800">💖 支持这个项目</h3>

      <div class="flex flex-wrap justify-center gap-4">
        <!-- GitHub Sponsors -->
        <!-- <button
          @click="open('https://github.com/sponsors/sonicsunsky')"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          <Icon name="mdi:github" size="20" />
          GitHub Sponsors
        </button> -->

        <!-- Buy Me a Coffee -->
        <!-- <button
          @click="open('https://buymeacoffee.com/sonicsunsky')"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-400 transition"
        >
          <Icon name="mdi:coffee" size="20" />
          Buy Me a Coffee
        </button> -->

        <!-- 微信收款 -->
        <button
          @click="showWeChat = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-400 transition"
        >
          <Icon name="mdi:wechat" size="20" />
          微信收款
        </button>

        <!-- 支付宝收款 -->
        <button
          @click="showAlipay = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-400 transition"
        >
          <Icon name="ant-design:alipay-outlined" size="20" />
          支付宝收款
        </button>
      </div>

      <!-- ✅ 新增底部导航链接 -->
      <nav
        class="flex flex-wrap justify-center gap-6 mt-2 text-sm text-gray-600"
      >
        <NuxtLink to="/about" class="hover:text-gray-900">关于我们</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-gray-900">联系我们</NuxtLink>
        <NuxtLink to="/privacy" class="hover:text-gray-900">隐私政策</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-900">使用条款</NuxtLink>
      </nav>

      <!-- QR Teleport 保持原样 -->
      <Teleport to="body">
        <div
          v-if="showWeChat"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-2xl shadow-xl text-center relative">
            <button
              @click="showWeChat = false"
              class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <Icon name="mdi:close" size="20" />
            </button>
            <h4 class="mb-3 text-lg font-semibold">微信收款码</h4>
            <img
              src="/images/wechat_qr.jpg"
              alt="微信收款码"
              class="w-48 h-48 object-contain mx-auto rounded-lg border"
            />
          </div>
        </div>

        <div
          v-if="showAlipay"
          class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-2xl shadow-xl text-center relative">
            <button
              @click="showAlipay = false"
              class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <Icon name="mdi:close" size="20" />
            </button>
            <h4 class="mb-3 text-lg font-semibold">支付宝收款码</h4>
            <img
              src="/images/alipay_qr.jpg"
              alt="支付宝收款码"
              class="w-48 h-48 object-contain mx-auto rounded-lg border"
            />
          </div>
        </div>
      </Teleport>

      <p class="text-sm text-gray-500 mt-4">
        © {{ new Date().getFullYear() }} 开发者工具箱
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";

const showWeChat = ref(false);
const showAlipay = ref(false);

const open = (url: string) => {
  window.open(url, "_blank");
};
</script>
