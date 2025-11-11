<template>
  <div class="max-w-3xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-center mb-4">
      颜色转换工具（Hex ↔ RGB ↔ HSL）
    </h1>
    <p class="text-gray-600 text-center mb-10">
      支持 Hex、RGB、HSL 色值相互转换，实时颜色预览，适用于设计师与前端工程师。
    </p>

    <section
      class="p-6 mb-10 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 leading-relaxed"
    >
      <h2 class="text-xl font-semibold mb-2">工具介绍</h2>
      <p>
        可快速转换颜色格式并实时预览结果，支持一键复制。适用于界面调色、样式开发等场景。
      </p>
    </section>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- 色值输入区域 -->
      <div>
        <label class="font-semibold">颜色选择 / Hex 输入</label>
        <div class="flex items-center gap-3 mt-2">
          <UInput type="color" v-model="hex" class="h-10 w-12 p-0" />

          <UInput
            v-model="hex"
            @input="onHexInput"
            placeholder="#1a73e8"
            class="p-2 w-40"
          />

          <UButton size="sm" @click="copy(hex)"> 📋 复制 </UButton>
        </div>

        <div class="mt-4 text-sm space-y-3 font-medium">
          <div class="flex items-center">
            RGB: <span class="ml-1">{{ rgbStr }}</span>
            <UButton size="xs" variant="soft" class="ml-2" @click="copy(rgbStr)"
              >复制</UButton
            >
          </div>

          <div class="flex items-center">
            HSL: <span class="ml-1">{{ hslStr }}</span>
            <UButton size="xs" variant="soft" class="ml-2" @click="copy(hslStr)"
              >复制</UButton
            >
          </div>
        </div>

        <!-- 数字调色（增强功能） -->
        <div class="mt-5 border-t pt-4">
          <h3 class="font-semibold text-sm mb-2">RGB 数值调节</h3>
          <div class="grid grid-cols-3 gap-2 text-sm">
            <UInput
              type="number"
              v-model.number="r"
              min="0"
              max="255"
              @input="syncFromRgb"
            />
            <UInput
              type="number"
              v-model.number="g"
              min="0"
              max="255"
              @input="syncFromRgb"
            />
            <UInput
              type="number"
              v-model.number="b"
              min="0"
              max="255"
              @input="syncFromRgb"
            />
          </div>
        </div>
      </div>

      <!-- 可视化展示 -->
      <div class="flex flex-col items-center">
        <div
          :style="{ background: hex }"
          class="w-48 h-48 rounded-lg border shadow"
        />
        <div class="mt-3 text-gray-600 text-sm">颜色实时预览</div>

        <div class="mt-3 w-full text-center text-sm text-gray-500">
          明度: {{ brightness }}% | 色相: {{ hue }}°
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const hex = ref("#1a73e8");

// RGB 绑定数据（可手动输入）
const r = ref(0),
  g = ref(0),
  b = ref(0);

onMounted(() => syncToRgb());

function normalizeHex(h: string) {
  if (h.length === 4)
    return (
      "#" +
      h
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    );
  return h;
}

function onHexInput(e: Event) {
  let v = (e.target as HTMLInputElement).value.trim();
  if (!v.startsWith("#")) v = "#" + v;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
    hex.value = normalizeHex(v);
    syncToRgb();
  }
}

// Hex → RGB
function syncToRgb() {
  const n = normalizeHex(hex.value);
  const [, rr, gg, bb] =
    n.match(/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/) || [];
  r.value = parseInt(rr, 16);
  g.value = parseInt(gg, 16);
  b.value = parseInt(bb, 16);
}

// RGB → Hex → 更新其它格式
function syncFromRgb() {
  r.value = Math.min(255, Math.max(0, r.value));
  g.value = Math.min(255, Math.max(0, g.value));
  b.value = Math.min(255, Math.max(0, b.value));
  hex.value =
    "#" +
    [r, g, b].map((x) => Number(x).toString(16).padStart(2, "0")).join("");
}

// RGB → HSL（用于展示计算）
const rgbStr = computed(() => `rgb(${r.value}, ${g.value}, ${b.value})`);

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const hsl = computed(() => rgbToHsl(r.value, g.value, b.value));
const hslStr = computed(
  () => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`
);

const brightness = computed(() => hsl.value.l);
const hue = computed(() => hsl.value.h);

async function copy(text: string) {
  await navigator.clipboard.writeText(text);
  alert("✅ 已复制！");
}
</script>
