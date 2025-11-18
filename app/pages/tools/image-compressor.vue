<template>
  <div class="max-w-4xl mx-auto py-10 px-4">
    <Head>
      <Title>在线图片压缩工具 - 开发者工具箱</Title>
      <Meta
        name="description"
        content="免费在线图片压缩工具，支持 JPG、PNG、WebP 格式，可自定义压缩质量。所有处理均在浏览器本地完成，保障隐私安全。"
      />
    </Head>

    <h1 class="text-3xl font-bold text-center mb-4">📷 在线图片压缩工具</h1>
    <p class="text-gray-600 text-center mb-10">
      无损或有损压缩 JPG、PNG 和 WebP
      格式图片，所有处理均在您的浏览器中本地完成。
    </p>

    <UAlert
      icon="i-heroicons-shield-check"
      color="success"
      variant="subtle"
      title="本地处理，安全可靠"
      description="您的图片文件不会上传到任何服务器。所有压缩算法都在浏览器中运行，隐私得到充分保护。"
      class="mb-8"
    />

    <UCard class="my-8">
      <template #header>
        <h2 class="text-xl font-semibold">1. 上传图片</h2>
      </template>

      <UFileUpload
        v-model="originalFile"
        accept="image/jpg,image/jpeg,image/png,image/webp"
        :multiple="false"
        :dropzone="true"
        color="primary"
        label="点击或拖拽文件到这里"
        :description="`支持 JPG, PNG, WebP 格式，单个文件最大 ${formatBytes(
          MAX_FILE_SIZE
        )}`"
      />

      <div
        v-if="originalFile"
        class="flex justify-between items-center text-sm text-gray-600 my-4"
      >
        <span>✅ 已加载文件: {{ originalFile.name }}</span>
        <span>原始大小: {{ formatBytes(originalFile.size) }}</span>
      </div>
    </UCard>

    <UCard v-if="originalFile" class="my-8">
      <template #header>
        <h2 class="text-xl font-semibold">2. 压缩设置</h2>
      </template>

      <div class="my-4">
        <div v-if="isLossyFormat">
          <div class="flex justify-between items-center mb-2">
            <label for="quality-slider" class="font-medium"
              >压缩质量 (仅影响 JPG/WebP): {{ quality }}%</label
            >
            <UBadge color="neutral" variant="soft">1 - 100</UBadge>
          </div>

          <USlider
            v-model="quality"
            size="xl"
            :min="1"
            :max="100"
            :step="1"
            @change="compressImage"
          />
        </div>

        <UAlert
          v-else-if="originalFile && originalFile.type === 'image/png'"
          icon="i-heroicons-information-circle"
          color="secondary"
          variant="soft"
          title="PNG 格式提示"
          description="PNG 是无损格式，调整质量无效。本工具将进行无损重编码，文件大小可能略有变化，甚至增大。"
        />
      </div>

      <div class="flex gap-4">
        <UButton
          color="primary"
          size="xl"
          :loading="isCompressing"
          :disabled="isCompressing"
          @click="compressImage"
        >
          <UIcon name="i-heroicons-adjustments-horizontal" />
          {{ isCompressing ? "压缩中..." : "重新压缩" }}
        </UButton>

        <UButton
          color="neutral"
          variant="soft"
          size="xl"
          icon="i-heroicons-trash"
          @click="clearAll"
        >
          清空
        </UButton>
      </div>
    </UCard>

    <UCard v-if="compressedUrl" class="my-8">
      <template #header>
        <h2 class="text-xl font-semibold flex justify-between items-center">
          3. 压缩结果
          <UButton
            color="success"
            size="lg"
            icon="i-heroicons-arrow-down-tray"
            @click="downloadImage"
          >
            下载压缩后的图片 ({{ formatBytes(compressedSize) }})
          </UButton>
        </h2>
      </template>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="border rounded-lg p-3">
          <h3 class="font-semibold text-center mb-2">
            原始图片 ({{ formatBytes(originalFile.size) }})
          </h3>
          <img
            :src="originalUrl"
            alt="原始图片"
            class="max-w-full h-auto rounded mx-auto"
          />
        </div>

        <div class="border rounded-lg p-3 relative">
          <h3 class="font-semibold text-center mb-2">
            压缩结果 ({{ formatBytes(compressedSize) }})
          </h3>
          <img
            :src="compressedUrl"
            alt="压缩图片"
            class="max-w-full h-auto rounded mx-auto"
          />

          <UBadge
            v-if="compressionRatio > 0"
            color="red"
            variant="solid"
            class="absolute top-2 right-2 text-base"
          >
            节省 {{ compressionRatio.toFixed(1) }}%
          </UBadge>
        </div>
      </div>

      <div class="text-center text-sm text-gray-700 mt-4">
        <p>
          原始大小: {{ formatBytes(originalFile.size) }} → 压缩后大小:
          {{ formatBytes(compressedSize) }}
        </p>
      </div>
    </UCard>

    <section class="mt-16 text-gray-700 leading-relaxed py-10 border-t">
      <h2 class="text-2xl font-bold mb-4">在线图片压缩工具的工作原理</h2>
      <p class="mb-3">
        本工具利用现代浏览器内置的 **Canvas API** (HTML5)
        进行图像重绘和导出。当您调整压缩质量时，我们通过 `canvas.toBlob()`
        方法，指定一个新的 **质量参数** (对于 JPEG/WebP) 或进行**颜色深度优化**
        (对于 PNG)，从而在不依赖服务器的情况下实现文件大小的缩减。
      </p>
      <p>
        由于所有计算都在您的设备上完成，这不仅确保了极快的处理速度，更重要的是，**您的图片数据在整个过程中都不会离开本地**，提供了最高级别的隐私保障。
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const originalFile = ref<File | null>(null);
const originalUrl = ref("");
const compressedUrl = ref("");
const compressedSize = ref(0);
const quality = ref(75); // 默认压缩质量 75%
const isCompressing = ref(false);

// --- 计算属性和辅助函数 ---

// 计算压缩率
const compressionRatio = computed(() => {
  if (originalFile.value && compressedSize.value > 0) {
    return (
      ((originalFile.value.size - compressedSize.value) /
        originalFile.value.size) *
      100
    );
  }
  return 0;
});

// 判断当前文件是否是有损格式 (支持质量参数)
const isLossyFormat = computed(() => {
  if (!originalFile.value) return false;
  const type = originalFile.value.type;
  return type === "image/jpeg" || type === "image/webp";
});

// --- 文件上传监听 (核心逻辑变更) ---

// 监听 uploadedFiles 数组的变化
watch(
  originalFile,
  (newFile) => {
    const file = newFile;

    if (file) {
      // 1. 文件大小校验
      if (file.size > MAX_FILE_SIZE) {
        toast.add({
          title: "文件过大",
          description: `文件不能超过 ${formatBytes(MAX_FILE_SIZE)}。`,
          color: "red",
        });
        clearAll();
        return;
      }

      clearResults();
      originalUrl.value = URL.createObjectURL(file);

      // 自动触发压缩
      compressImage();
    } else {
      // 如果数组清空了，则清空所有状态
      clearAll();
    }
  },
  { deep: true }
);

// --- 核心压缩函数 ---

async function compressImage() {
  if (!originalFile.value) return;

  isCompressing.value = true;
  compressedUrl.value = "";
  compressedSize.value = 0;

  try {
    const file = originalFile.value;

    // 💡 优化点：确定 Canvas 导出 MIME 类型，优先使用原文件类型
    const mimeType = file.type;

    // 0. 读取图片数据
    const img = await createImageBitmap(file);

    // 1. 创建 Canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法获取 Canvas 上下文");

    // 2. 绘制图片到 Canvas
    ctx.drawImage(img, 0, 0);

    // 3. 压缩并导出 (转为 Blob)
    const qualityFactor = quality.value / 100;

    const compressedBlob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("压缩失败，无法创建 Blob。"));
          }
        },
        mimeType,
        // 💡 优化点：只有在文件是有损格式时才传递 qualityFactor
        isLossyFormat.value ? qualityFactor : undefined
      );
    });

    // 4. 更新结果
    compressedSize.value = compressedBlob.size;
    compressedUrl.value = URL.createObjectURL(compressedBlob);

    toast.add({
      title: "压缩完成",
      description: `图片已成功压缩到 ${formatBytes(compressedBlob.size)}。`,
      color: "success",
    });
  } catch (error) {
    console.error("压缩过程中发生错误:", error);
    toast.add({
      title: "压缩失败",
      description: "图片处理出错，请检查文件是否损坏或格式是否受支持。",
      color: "error",
    });
  } finally {
    isCompressing.value = false;
  }
}

// 下载压缩结果
async function downloadImage() {
  if (!compressedUrl.value || !originalFile.value) return;

  const link = document.createElement("a");
  const originalName = originalFile.value.name;
  const extension = originalName.substring(originalName.lastIndexOf("."));
  const baseName = originalName.substring(0, originalName.lastIndexOf("."));

  link.href = compressedUrl.value;
  link.download = `${baseName}-compressed${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 清空所有状态
function clearAll() {
  originalFile.value = null;
  originalUrl.value = "";
  clearResults();
  toast.add({
    title: "已清空",
    description: "工具状态已重置。",
    color: "neutral",
  });
}

function clearResults() {
  // 释放对象 URL 内存
  if (compressedUrl.value) {
    URL.revokeObjectURL(compressedUrl.value);
  }
  if (originalUrl.value) {
    URL.revokeObjectURL(originalUrl.value);
  }
  compressedUrl.value = "";
  compressedSize.value = 0;
  isCompressing.value = false;
}

// 格式化字节大小 (例如: 102400 -> 100 KB)
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

onUnmounted(() => {
  // 离开页面时清理 URL 对象，防止内存泄漏
  clearResults();
});
</script>
