<template>
  <ToolLayout>
    <h2 class="text-lg font-bold mb-4">QR 码生成器</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="font-medium">输入文本 / 链接</label>
        <textarea
          v-model="text"
          rows="4"
          class="w-full border p-2 rounded mt-1"
          placeholder="例如：https://example.com"
        ></textarea>

        <div class="mt-3 flex items-center gap-2">
          <label class="flex items-center gap-2">
            <input
              type="number"
              v-model.number="size"
              min="64"
              max="2048"
              class="w-24 p-1 border rounded"
            />
            尺寸(px)
          </label>

          <label class="flex items-center gap-2">
            纠错级别:
            <select v-model="ecLevel" class="ml-2 p-1 border rounded">
              <option value="L">L（7%）</option>
              <option value="M">M（15%）</option>
              <option value="Q">Q（25%）</option>
              <option value="H">H（30%）</option>
            </select>
          </label>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            @click="generate"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
            生成
          </button>
          <button
            @click="download"
            :disabled="!dataUrl"
            class="bg-gray-600 text-white px-4 py-2 rounded"
          >
            下载 PNG
          </button>
          <button
            @click="copy"
            :disabled="!dataUrl"
            class="bg-green-600 text-white px-4 py-2 rounded"
          >
            复制图片地址
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center">
        <div v-if="loading" class="p-8">生成中...</div>
        <img
          v-if="dataUrl"
          :src="dataUrl"
          :alt="text"
          :width="size"
          :height="size"
          class="border rounded"
        />
        <div v-else class="text-sm text-gray-500">生成的二维码将显示在这里</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import { ref } from "vue";

const text = ref("https://");
const size = ref(256);
const ecLevel = ref<"L" | "M" | "Q" | "H">("M");
const dataUrl = ref<string>("");
const loading = ref(false);

async function generate() {
  if (!text.value) return;
  loading.value = true;
  try {
    dataUrl.value = await QRCode.toDataURL(text.value, {
      width: size.value,
      errorCorrectionLevel: ecLevel.value,
    });
  } catch (e) {
    alert("二维码生成失败：" + (e as Error).message);
  } finally {
    loading.value = false;
  }
}

function download() {
  if (!dataUrl.value) return;
  const a = document.createElement("a");
  a.href = dataUrl.value;
  a.download = `qrcode.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function copy() {
  if (!dataUrl.value) return;
  navigator.clipboard.writeText(dataUrl.value).then(() => {
    alert("图片 DataURL 已复制到剪贴板（可粘贴到文件或新标签打开）");
  });
}
</script>
