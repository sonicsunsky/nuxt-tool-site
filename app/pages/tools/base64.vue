<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <h1 class="text-4xl font-extrabold text-center mb-2">Base64 编解码工具</h1>
    <p class="text-lg text-gray-500 text-center mb-10">
      支持在线 Base64 字符串实时编码/解码，完全在浏览器本地运行。
    </p>

    <UCard class="mb-10" :ui="{ body: { base: 'space-y-4' } }">
      <template #header>
        <h2 class="text-xl font-semibold">ℹ️ 工具介绍与使用</h2>
      </template>
      <p>
        Base64 是一种用于将二进制内容转换成文本格式的编码方式，常用于： 图片
        DataURL、Token 传输、或安全地在 URL 中携带数据等。本工具支持 **UTF-8
        编码**。
      </p>

      <h3 class="text-lg font-medium mt-4">使用步骤：</h3>
      <ol class="list-decimal ml-6 space-y-1 text-gray-700">
        <li>在下方文本框输入或粘贴任意文本或 Base64 字符串。</li>
        <li>点击「编码 Base64」或「解码 Base64」按钮进行操作。</li>
        <li>结果将显示在下方输出区，可一键复制或互换输入。</li>
      </ol>
      <template #footer>
        <p class="text-xs text-gray-400 italic">
          ⚠️ 本工具完全在浏览器中运行，不上传任何数据，请放心使用。
        </p>
      </template>
    </UCard>

    <UTextarea
      v-model="input"
      :rows="6"
      autoResize
      class="w-full rounded-lg"
      placeholder="请输入需要编/解码的文本或 Base64 字符串..."
    />

    <div class="text-right mt-1 text-gray-500 text-sm">
      当前输入：**{{ input.length }}** 字
    </div>

    <div class="mt-4 flex gap-2 flex-wrap">
      <UButton
        color="primary"
        size="lg"
        icon="i-heroicons-lock-closed"
        :disabled="isInputEmpty"
        @click="encode"
      >
        编码 Base64
      </UButton>

      <UButton
        color="info"
        size="lg"
        icon="i-heroicons-lock-open"
        :disabled="isInputEmpty"
        @click="decode"
      >
        解码 Base64
      </UButton>

      <UButton
        variant="outline"
        size="lg"
        icon="i-heroicons-arrow-path-rounded-square"
        :disabled="!output"
        @click="swapIO"
      >
        互换 🔁
      </UButton>

      <UButton
        color="neutral"
        variant="soft"
        size="lg"
        icon="i-heroicons-trash"
        :disabled="isInputEmpty && !output"
        @click="clearInput"
      >
        清空
      </UButton>
    </div>

    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle-20-solid"
      color="red"
      variant="subtle"
      class="mt-4"
      :title="error"
    />

    <UCard v-if="output" class="mt-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-semibold flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="text-xl" />
            输出结果
          </h3>
          <UButton
            variant="soft"
            size="sm"
            icon="i-heroicons-clipboard-document"
            @click="copyOutput"
          >
            复制
          </UButton>
        </div>
      </template>
      <pre class="text-sm whitespace-pre-wrap break-all p-2">{{ output }}</pre>
    </UCard>
  </div>
</template>

<script setup lang="ts">
// 引入 Nuxt UI 的 useToast
const toast = useToast();
const input = ref("");
const output = ref("");
const error = ref("");

// 计算属性：判断输入是否为空，用于控制按钮禁用状态
const isInputEmpty = computed(() => !input.value.trim());

// 优化后的 Base64 编码 (支持 UTF-8)
function encode() {
  if (isInputEmpty.value) {
    error.value = "请输入需要编码的文本";
    output.value = "";
    return;
  }
  try {
    error.value = "";
    // 1. 使用 TextEncoder 将 UTF-8 字符串转换为 Uint8Array
    const utf8Bytes = new TextEncoder().encode(input.value);
    // 2. 将 Uint8Array 转换为 Binary String
    //    这里使用 String.fromCodePoint 是处理大数据的现代且高效的方式
    const binaryString = String.fromCodePoint(...utf8Bytes);
    // 3. 使用 btoa 进行 Base64 编码
    output.value = btoa(binaryString);
  } catch (err) {
    error.value = "❌ 编码失败，请检查输入是否为有效文本";
  }
}

// 优化后的 Base64 解码 (支持 UTF-8, 增加长度校验)
function decode() {
  if (isInputEmpty.value) {
    error.value = "请输入需要解码的 Base64 字符串";
    output.value = "";
    return;
  }

  const base64Input = input.value.trim();
  // 基础校验：Base64 字符串长度必须是 4 的倍数 (不包括末尾的 = 补位)
  if (base64Input.length % 4 !== 0) {
    error.value = "❌ Base64 字符串长度不符合规范 (长度不是 4 的倍数)";
    output.value = "";
    return;
  }

  try {
    error.value = "";
    // 1. 使用 atob 进行 Base64 解码，得到 Binary String
    const binaryString = atob(base64Input);
    // 2. 将 Binary String 转换为 Uint8Array
    const uint8Array = Uint8Array.from(
      binaryString,
      (c) => c.codePointAt(0) ?? 0
    );
    // 3. 使用 TextDecoder 将 Uint8Array 转换为 UTF-8 字符串
    output.value = new TextDecoder().decode(uint8Array);
  } catch (e) {
    // atob 可能会因为无效字符抛出异常
    error.value = "❌ 解码失败，请检查 Base64 内容是否包含非法字符";
  }
}

function clearInput() {
  input.value = "";
  output.value = "";
  error.value = "";
  toast.add({
    title: "已清空输入和结果",
    icon: "i-heroicons-trash",
    timeout: 2000,
    color: "neutral",
  });
}

// 新增功能：互换输入/输出
function swapIO() {
  if (output.value) {
    input.value = output.value;
    output.value = "";
    error.value = "";
    toast.add({
      title: "输入/输出内容已互换",
      icon: "i-heroicons-arrow-path-rounded-square",
      timeout: 2000,
    });
  }
}

// 使用 Nuxt UI 的 useToast 替换 alert()
async function copyOutput() {
  if (!output.value) return;

  try {
    await navigator.clipboard.writeText(output.value);
    toast.add({
      title: "复制成功",
      description: "✅ 结果已复制到剪贴板。",
      icon: "i-heroicons-check-circle",
      timeout: 3000,
    });
  } catch (err) {
    toast.add({
      title: "复制失败",
      description: "请检查浏览器权限，或手动复制结果。",
      icon: "i-heroicons-exclamation-triangle",
      color: "red",
    });
  }
}
</script>
