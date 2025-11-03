<template>
  <div>
    <h2 class="text-lg font-bold mb-4">密码生成器</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="font-medium">长度</label>

        <UInput
          type="number"
          v-model.number="length"
          :min="4"
          :max="128"
          class="w-32 p-2 rounded mt-1"
        />

        <div class="mt-3 space-y-2">
          <UCheckbox
            v-model="useUpper"
            label="包含大写字母
            (A-Z)"
          ></UCheckbox>
          <UCheckbox
            v-model="useLower"
            label="包含小写字母
            (a-z)"
          ></UCheckbox>
          <UCheckbox
            v-model="useNumbers"
            label="包含数字
            (0-9)"
          ></UCheckbox>
          <UCheckbox
            v-model="useSymbols"
            label="包含符号
            (!@#$...)"
          ></UCheckbox>
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
            color="primary"
            size="xl"
            @click="copyOne"
            class="px-4 py-2 rounded"
            :disabled="!pw"
          >
            复制
          </UButton>
        </div>
      </div>

      <div>
        <label class="font-medium">生成结果</label>
        <UTextarea
          readonly
          v-model="pw"
          :rows="4"
          class="w-full p-2 rounded mt-1"
        >
        </UTextarea>

        <div class="mt-4">
          <UButton
            color="neutral"
            variant="outline"
            size="xl"
            @click="generateBatch"
            class="px-3 py-1 rounded"
          >
            批量生成 10 个
          </UButton>
        </div>

        <pre
          v-if="batch.length"
          class="mt-3 bg-gray-50 p-3 rounded h-60 overflow-auto text-sm"
          >{{ batch.join("\n") }}</pre
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useToolSeo } from "~/utils/useToolSeo";
// useToolSeo();

const length = ref(16);
const useUpper = ref(true);
const useLower = ref(true);
const useNumbers = ref(true);
const useSymbols = ref(false);

const pw = ref("");
const batch = ref<string[]>([]);

const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generate() {
  const pools: string[] = [];
  if (useUpper.value) pools.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (useLower.value) pools.push("abcdefghijklmnopqrstuvwxyz");
  if (useNumbers.value) pools.push("0123456789");
  if (useSymbols.value) pools.push(SYMBOLS);

  if (!pools.length) {
    alert("请至少选择一个字符集");
    return;
  }

  // 确保每类至少出现一个字符（更安全）
  const mandatory: string[] = pools.map(
    (p) => p[Math.floor(Math.random() * p.length)]
  );
  let chars = mandatory.join("");
  const all = pools.join("");

  console.log("generate-------------------: ", pools, mandatory);

  for (let i = chars.length; i < length.value; i++) {
    chars += all[Math.floor(Math.random() * all.length)];
  }
  // 打乱
  pw.value = chars
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function copyOne() {
  if (!pw.value) return;
  navigator.clipboard.writeText(pw.value).then(() => alert("已复制"));
}

function generateBatch() {
  batch.value = Array.from({ length: 10 }).map(() => {
    generate();
    return pw.value;
  });
}
</script>
