<template>
  <div>
    <h2 class="text-lg font-bold mb-4">QR 码生成器</h2>

    <section
      class="mt-8 leading-relaxed text-gray-600 text-sm bg-gray-50 p-4 rounded-xl"
    >
      <h3 class="text-lg font-bold mb-2">什么是二维码生成器？</h3>
      <p>
        二维码生成器可将任意文本或链接转换成二维码图像，方便在网站、活动或文件中快速分享。
        支持选择二维码尺寸与纠错等级，所有生成操作均在本地完成，无需上传服务器。
      </p>

      <h3 class="text-lg font-bold mt-4 mb-2">使用方法</h3>
      <ol class="list-decimal ml-6 space-y-1">
        <li>输入文本或网址</li>
        <li>调整二维码尺寸与纠错级别</li>
        <li>点击「生成二维码」即可展示图片</li>
        <li>支持下载或复制二维码图片</li>
      </ol>
    </section>

    <div class="grid md:grid-cols-2 gap-8 mt-8">
      <!-- 左侧控制区 -->
      <div>
        <label class="font-medium">输入文本 / 链接</label>
        <UTextarea
          v-model="text"
          :rows="5"
          autoresize
          class="w-full p-2 rounded mt-1"
          placeholder="例如：https://example.com"
        />

        <div class="mt-4 flex flex-wrap items-center gap-4">
          <div>
            <label class="font-medium mr-2">尺寸(px)</label>
            <UInput
              type="number"
              v-model.number="size"
              :min="64"
              :max="1024"
              class="w-32 p-2 rounded mt-1"
            />
          </div>

          <div>
            <label class="font-medium mr-2">纠错级别</label>
            <USelect
              v-model="ecLevel"
              :items="ecOptions"
              size="xl"
              class="w-32 p-2 rounded mt-1"
            />
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <UButton color="secondary" size="xl" @click="generate">
            生成二维码
          </UButton>
          <UButton
            color="neutral"
            size="xl"
            :disabled="!dataUrl"
            @click="download"
          >
            下载 PNG
          </UButton>
          <UButton color="primary" size="xl" :disabled="!dataUrl" @click="copy">
            复制 Data URL
          </UButton>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="flex flex-col items-center justify-center text-center">
        <div v-if="loading" class="p-8 text-gray-500">生成中，请稍候...</div>

        <img
          v-if="dataUrl"
          :src="dataUrl"
          :alt="text"
          :width="size"
          :height="size"
          class="border rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
        />

        <div v-else class="text-gray-500 text-sm mt-8">二维码将显示在这里</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";

const toast = useToast();

const text = ref("https://");
const size = ref(256);
const ecLevel = ref<"L" | "M" | "Q" | "H">("M");
const dataUrl = ref<string>("");
const loading = ref(false);

const ecOptions = [
  { label: "L（7%）", value: "L" },
  { label: "M（15%）", value: "M" },
  { label: "Q（25%）", value: "Q" },
  { label: "H（30%）", value: "H" },
];

async function generate() {
  if (!text.value.trim()) {
    toast.add({
      title: "⚠️ 提示",
      description: "请输入文本或链接后再生成二维码",
      color: "warning",
    });
    return;
  }

  loading.value = true;
  try {
    dataUrl.value = await QRCode.toDataURL(text.value, {
      width: size.value,
      errorCorrectionLevel: ecLevel.value,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    toast.add({
      title: "✅ 生成成功",
      description: "二维码已成功生成，可下载或复制",
      color: "success",
    });
  } catch (e) {
    toast.add({
      title: "❌ 生成失败",
      description: (e as Error).message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

function download() {
  if (!dataUrl.value) return;
  const a = document.createElement("a");
  a.href = dataUrl.value;
  a.download = `qrcode_${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  toast.add({
    title: "💾 已下载",
    description: "二维码 PNG 文件已下载",
    color: "success",
  });
}

function copy() {
  if (!dataUrl.value) return;
  navigator.clipboard.writeText(dataUrl.value);
  toast.add({
    title: "📋 已复制",
    description: "二维码 Data URL 已复制到剪贴板",
    color: "success",
  });
}
</script>
