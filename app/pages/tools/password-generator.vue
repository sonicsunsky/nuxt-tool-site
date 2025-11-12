<template>
  <div>
    <h2 class="text-lg font-bold mb-4">密码生成器</h2>

    <section
      class="mt-10 p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed"
    >
      <h3 class="text-lg font-bold mb-2">密码生成工具说明</h3>
      <p>
        本工具可生成随机强密码，支持自定义长度与字符规则，提升账户安全性。
        密码仅在本地生成，不会上传服务器。
      </p>
    </section>

    <div class="grid md:grid-cols-2 gap-6 mt-6">
      <!-- 左侧控制区 -->
      <div>
        <label class="font-medium">密码长度</label>
        <UInput
          type="number"
          v-model.number="length"
          :min="4"
          :max="128"
          class="w-32 p-2 rounded mt-1"
        />

        <div class="mt-3 space-y-2">
          <UCheckbox v-model="useUpper" label="包含大写字母 (A-Z)" />
          <UCheckbox v-model="useLower" label="包含小写字母 (a-z)" />
          <UCheckbox v-model="useNumbers" label="包含数字 (0-9)" />
          <UCheckbox v-model="useSymbols" label="包含符号 (!@#$%^&*)" />
        </div>

        <div class="mt-5 flex gap-3">
          <UButton color="secondary" size="xl" @click="generate">
            生成密码
          </UButton>
          <UButton color="primary" size="xl" :disabled="!pw" @click="copyOne">
            复制密码
          </UButton>
        </div>
      </div>

      <!-- 右侧显示区 -->
      <div>
        <label class="font-medium">生成结果</label>
        <UTextarea
          readonly
          v-model="pw"
          :rows="3"
          class="w-full p-2 rounded mt-1 text-lg font-mono"
        />

        <div class="mt-4">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="generateBatch"
          >
            批量生成 10 个密码
          </UButton>
        </div>

        <pre
          v-if="batch.length"
          class="mt-3 bg-gray-100 p-3 rounded h-60 overflow-auto text-sm font-mono"
          >{{ batch.join("\n") }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();

const length = ref(16);
const useUpper = ref(true);
const useLower = ref(true);
const useNumbers = ref(true);
const useSymbols = ref(false);

const pw = ref("");
const batch = ref<string[]>([]);

const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

// ✅ 使用更安全的随机函数
function randomChar(chars: string): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return chars[array[0] % chars.length];
}

function generate() {
  const pools: string[] = [];
  if (useUpper.value) pools.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (useLower.value) pools.push("abcdefghijklmnopqrstuvwxyz");
  if (useNumbers.value) pools.push("0123456789");
  if (useSymbols.value) pools.push(SYMBOLS);

  if (!pools.length) {
    toast.add({
      title: "⚠️ 提示",
      description: "请至少选择一个字符集",
      color: "warning",
    });
    return;
  }

  const allChars = pools.join("");
  let password = "";

  // ✅ 每种类型至少保证一个字符
  pools.forEach((p) => (password += randomChar(p)));

  // ✅ 填充剩余长度
  while (password.length < length.value) {
    password += randomChar(allChars);
  }

  // ✅ 打乱顺序
  pw.value = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function copyOne() {
  if (!pw.value) return;
  navigator.clipboard.writeText(pw.value);
  toast.add({
    title: "✅ 已复制密码",
    description: "密码已复制到剪贴板",
    color: "success",
  });
}

function generateBatch() {
  const list: string[] = [];
  for (let i = 0; i < 10; i++) {
    generate();
    list.push(pw.value);
  }
  batch.value = list;

  toast.add({
    title: "🎉 批量生成成功",
    description: "已生成 10 个随机密码",
    color: "success",
  });
}
</script>
