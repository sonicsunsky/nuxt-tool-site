<template>
  <UContainer class="py-10 max-w-4xl">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        PDF / 图片 格式转换工具
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        纯本地处理，文件不上传服务器，安全快速
      </p>
    </div>

    <ClientOnly>
      <template #fallback>
        <div class="flex justify-center p-12">
          <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8" />
        </div>
      </template>

      <UTabs :items="items" class="w-full">
        <template #pdf-view>
          <UCard class="mt-4">
            <div class="space-y-6">
              <div v-if="!pdfFile" class="animate-fade-in">
                <div
                  v-if="isProcessingFile"
                  class="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg"
                >
                  <UIcon
                    name="i-heroicons-arrow-path"
                    class="animate-spin w-10 h-10 mb-3 text-primary-500"
                  />
                  <p class="font-medium">正在解析 PDF 文件结构...</p>
                  <p class="text-xs mt-1">大型文件可能需要几秒钟</p>
                </div>

                <UFileUpload
                  v-else
                  v-model="rawPdfFiles"
                  accept="application/pdf"
                  :multiple="false"
                  class="w-full h-64"
                  icon="i-heroicons-document-text"
                  label="点击或拖拽 PDF 文件到这里"
                  description="支持任意大小的 PDF 文件，纯本地解析"
                  @change="onPdfChange"
                />
              </div>

              <div v-else class="space-y-4 animate-fade-in">
                <div
                  class="flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 p-3 rounded-md border border-primary-100 dark:border-primary-800"
                >
                  <div class="flex items-center gap-2 overflow-hidden">
                    <UIcon
                      name="i-heroicons-paper-clip"
                      class="text-primary-500"
                    />
                    <div class="flex flex-col">
                      <span class="truncate font-medium text-sm">{{
                        pdfFile.name
                      }}</span>
                      <span class="text-xs text-gray-500"
                        >{{ formatBytes(pdfFile.size) }} •
                        {{ pdfPageCount }} 页</span
                      >
                    </div>
                  </div>
                  <UButton
                    color="red"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    size="xs"
                    @click="resetPdfState"
                  />
                </div>

                <div class="flex gap-4 items-center">
                  <div class="flex-1">
                    <label class="text-xs font-medium mb-1 block text-gray-500"
                      >输出图片格式</label
                    >
                    <USelect
                      v-model="pdfOutputFormat"
                      :items="['png', 'jpeg']"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="text-xs font-medium mb-1 block text-gray-500"
                      >清晰度 (倍率)</label
                    >
                    <USelect
                      v-model="pdfScale"
                      :items="[
                        { label: '1.5x (标准)', value: 1.5 },
                        { label: '3.0x (超清)', value: 3 },
                      ]"
                    />
                  </div>
                </div>

                <UButton
                  block
                  size="lg"
                  :loading="isConvertingPdf"
                  @click="convertPdfToImages"
                >
                  {{
                    isConvertingPdf
                      ? `正在处理第 ${currentConvertPage} / ${pdfPageCount} 页...`
                      : "开始转换并下载 ZIP"
                  }}
                </UButton>

                <UProgress
                  v-if="isConvertingPdf"
                  :value="currentConvertPage"
                  :max="pdfPageCount"
                  color="primary"
                />
              </div>
            </div>
          </UCard>
        </template>

        <template #img-view>
          <UCard class="mt-4">
            <div class="space-y-6">
              <div class="animate-fade-in">
                <UFileUpload
                  v-model="rawImgFiles"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  class="w-full"
                  :class="selectedImages.length > 0 ? 'h-32' : 'h-64'"
                  icon="i-heroicons-photo"
                  label="点击或拖拽图片到这里"
                  :description="
                    selectedImages.length > 0
                      ? '继续添加更多图片'
                      : '支持多选，JPG / PNG / WebP'
                  "
                  @change="onImgChange"
                />
              </div>

              <div
                v-if="selectedImages.length > 0"
                class="space-y-2 animate-fade-in"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-bold"
                    >已选 {{ selectedImages.length }} 张图片</span
                  >
                  <UButton
                    size="xs"
                    color="red"
                    variant="link"
                    @click="selectedImages = []"
                    >清空全部</UButton
                  >
                </div>

                <div
                  class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                >
                  <div
                    v-for="(img, idx) in selectedImages"
                    :key="idx"
                    class="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border dark:border-gray-700 group shadow-sm"
                  >
                    <img :src="img.url" class="w-full h-full object-cover" />
                    <button
                      class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                      @click.stop="removeImage(idx)"
                    >
                      <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                    </button>
                    <div
                      class="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] px-2 py-0.5 truncate w-full text-center backdrop-blur-sm"
                    >
                      {{ idx + 1 }}
                    </div>
                  </div>
                </div>

                <div class="pt-6 mt-6 border-t dark:border-gray-700">
                  <div class="flex gap-4 mb-6">
                    <div class="flex-1">
                      <label
                        class="text-xs font-medium mb-1 block text-gray-500"
                        >页面方向</label
                      >
                      <USelect
                        v-model="pdfOrientation"
                        :items="[
                          { label: '纵向 (Portrait)', value: 'p' },
                          { label: '横向 (Landscape)', value: 'l' },
                        ]"
                      />
                    </div>
                    <div class="flex-1">
                      <label
                        class="text-xs font-medium mb-1 block text-gray-500"
                        >页面边距</label
                      >
                      <USelect
                        v-model="pdfMargin"
                        :items="[
                          { label: '无边距', value: 0 },
                          { label: '小边距 (10mm)', value: 10 },
                          { label: '标准 (20mm)', value: 20 },
                        ]"
                      />
                    </div>
                  </div>

                  <UButton
                    block
                    size="lg"
                    :loading="isGeneratingPdf"
                    @click="generatePdf"
                  >
                    {{ isGeneratingPdf ? "正在生成..." : "合并并导出 PDF" }}
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>
        </template>
      </UTabs>
    </ClientOnly>
  </UContainer>
</template>

<script setup lang="ts">
import { jsPDF } from "jspdf";
import JSZip from "jszip";

// @ts-ignore
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

useHead({
  title: "PDF/图片转换工具 - 开发者工具箱",
  meta: [
    {
      name: "description",
      content: "在线免费将PDF转为图片，或将多张图片合并为PDF",
    },
  ],
});

const items = [
  {
    label: "PDF 转 图片",
    key: "pdf2img",
    icon: "i-heroicons-document-duplicate",
    slot: "pdf-view",
  },
  {
    label: "图片 转 PDF",
    key: "img2pdf",
    icon: "i-heroicons-photo",
    slot: "img-view",
  },
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// =========================================
// 通用工具：标准化文件输入
// 处理 UFileUpload 返回值可能是 单个文件 或 文件数组 的情况
// =========================================
const normalizeFiles = (input: File | File[] | null | undefined): File[] => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return [input];
};

// ====================
// Logic: PDF -> Image
// ====================
// 修改定义：允许 null, File, 或 File[]
const rawPdfFiles = ref<File | File[] | null>(null);
const pdfFile = ref<File | null>(null);
const pdfPageCount = ref(0);
const isConvertingPdf = ref(false);
const isProcessingFile = ref(false);
const currentConvertPage = ref(0);
const pdfOutputFormat = ref("png");
const pdfScale = ref(1.5);
let pdfDoc: any = null;

const onPdfChange = async () => {
  // 1. 使用 normalizeFiles 统一处理
  const files = normalizeFiles(rawPdfFiles.value);

  if (files.length > 0) {
    const file = files[0];
    isProcessingFile.value = true;
    await loadPdf(file);
    isProcessingFile.value = false;

    // 解析完成后清空，防止UI一直显示上传的文件名（因为我们有自己的状态栏了）
    rawPdfFiles.value = null;
  }
};

const resetPdfState = () => {
  pdfFile.value = null;
  rawPdfFiles.value = null;
  pdfPageCount.value = 0;
  pdfDoc = null;
  isProcessingFile.value = false;
};

const initPdfWorker = async () => {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  return pdfjsLib;
};

const loadPdf = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await initPdfWorker();

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl:
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@" +
        pdfjsLib.version +
        "/cmaps/",
      cMapPacked: true,
    });

    const doc = await loadingTask.promise;
    pdfDoc = doc;
    pdfPageCount.value = doc.numPages;
    pdfFile.value = file;
  } catch (err: any) {
    console.error("PDF Load Error Detail:", err);
    let msg = "无法解析 PDF 文件";
    if (err.name === "PasswordException") {
      msg = "该 PDF 文件受密码保护，请先移除密码";
    } else if (err.name === "MissingPDFException") {
      msg = "文件损坏或不是有效的 PDF";
    }
    alert(msg);
    resetPdfState();
  }
};

const convertPdfToImages = async () => {
  if (!pdfDoc) return;
  isConvertingPdf.value = true;
  currentConvertPage.value = 0;

  const zip = new JSZip();
  const folder = zip.folder("images");

  try {
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      currentConvertPage.value = i;
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: Number(pdfScale.value) });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context!, viewport: viewport })
        .promise;

      const format =
        pdfOutputFormat.value === "png" ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(format, 0.85);
      const fileName = `page-${String(i).padStart(3, "0")}.${
        pdfOutputFormat.value
      }`;

      folder?.file(fileName, dataUrl.split(",")[1], { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${pdfFile.value?.name.replace(".pdf", "")}-images.zip`;
    link.click();
  } catch (err) {
    console.error(err);
    alert("转换出错，请检查控制台日志");
  } finally {
    isConvertingPdf.value = false;
  }
};

// ====================
// Logic: Image -> PDF
// ====================
// 修改定义：允许 File[] 或 null（根据组件实现可能不同）
const rawImgFiles = ref<File | File[] | null>([]);
const selectedImages = ref<{ file: File; url: string }[]>([]);
const isGeneratingPdf = ref(false);
const pdfOrientation = ref<"p" | "l">("p");
const pdfMargin = ref(10);

const onImgChange = () => {
  // 1. 使用 normalizeFiles 统一处理
  const files = normalizeFiles(rawImgFiles.value);

  if (files.length > 0) {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        selectedImages.value.push({ file, url });
      }
    });
    // 立即清空，允许连续添加
    rawImgFiles.value = [];
  }
};

const removeImage = (index: number) => {
  selectedImages.value.splice(index, 1);
};

const generatePdf = () => {
  if (selectedImages.value.length === 0) return;
  isGeneratingPdf.value = true;

  try {
    const doc = new jsPDF({
      orientation: pdfOrientation.value,
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = Number(pdfMargin.value);
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    selectedImages.value.forEach((imgItem, index) => {
      if (index > 0) doc.addPage();

      const imgProps = doc.getImageProperties(imgItem.url);
      const imgWidth = imgProps.width;
      const imgHeight = imgProps.height;

      const ratio = Math.min(
        availableWidth / imgWidth,
        availableHeight / imgHeight
      );
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      doc.addImage(
        imgItem.url,
        imgProps.fileType,
        x,
        y,
        finalWidth,
        finalHeight
      );
    });

    doc.save("combined-images.pdf");
  } catch (err) {
    console.error(err);
    alert("生成 PDF 失败");
  } finally {
    isGeneratingPdf.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
