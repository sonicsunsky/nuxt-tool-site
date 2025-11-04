<template>
  <div>
    <h2 class="text-lg font-bold mb-4">QR 码生成器</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="font-medium">输入文本 / 链接</label>
        <UTextarea
          v-model="text"
          :rows="5"
          autoresize
          class="w-full p-2 rounded mt-1"
          placeholder="例如：https://example.com"
        ></UTextarea>

        <div class="mt-3 flex items-center gap-2">
          <label class="flex items-center gap-2">
            <UInput
              type="number"
              v-model.number="size"
              :min="64"
              :max="2048"
              class="w-32 p-1 rounded"
            />
            尺寸(px)
          </label>

          <label class="flex items-center gap-2">
            纠错级别:
            <USelect
              v-model="ecLevel"
              :items="[
                {
                  label: 'L（7%）',
                  value: 'L',
                },
                {
                  label: 'M（15%）',
                  value: 'M',
                },
                {
                  label: 'Q（25%）',
                  value: 'Q',
                },
                {
                  label: 'H（30%）',
                  value: 'H',
                },
              ]"
              size="xl"
              class="w-32 ml-2 p-1 rounded"
            />
          </label>
        </div>

        <div class="mt-4 flex gap-2">
          <UButton
            color="secondary"
            size="xl"
            @click="generate"
            class="px-4 py-2 rounded"
          >
            生成
          </UButton>
          <UButton
            color="neutral"
            size="xl"
            @click="download"
            :disabled="!dataUrl"
            class="px-4 py-2 rounded"
          >
            下载 PNG
          </UButton>
          <UButton
            color="primary"
            size="xl"
            @click="copy"
            :disabled="!dataUrl"
            class="px-4 py-2 rounded"
          >
            复制图片地址
          </UButton>
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
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";

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
