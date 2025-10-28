<template>
  <ToolLayout>
    <h2 class="text-lg font-bold mb-4">颜色转换器（Hex ↔ RGB ↔ HSL）</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="font-medium">选择颜色 / 输入 Hex</label>
        <div class="flex items-center gap-3 mt-2">
          <input
            type="color"
            v-model="hex"
            class="h-10 w-12 p-0 border rounded"
          />
          <input
            v-model="hex"
            @input="onHexInput"
            placeholder="#1a73e8"
            class="border p-2 rounded w-40"
          />
          <button
            @click="copyHex"
            class="bg-gray-700 text-white px-3 py-1 rounded"
          >
            复制 Hex
          </button>
        </div>

        <div class="mt-4 space-y-2 text-sm">
          <div>
            RGB: <strong>{{ rgbStr }}</strong>
            <button @click="copy(rgbStr)" class="ml-2 text-xs underline">
              复制
            </button>
          </div>
          <div>
            HSL: <strong>{{ hslStr }}</strong>
            <button @click="copy(hslStr)" class="ml-2 text-xs underline">
              复制
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center">
        <div :style="{ background: hex }" class="w-40 h-40 rounded-lg border" />
        <div class="mt-3 text-sm text-gray-600">颜色预览</div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const hex = ref("#1a73e8");

function onHexInput(e: Event) {
  let v = (e.target as HTMLInputElement).value.trim();
  if (!v.startsWith("#")) v = "#" + v;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) hex.value = normalizeHex(v);
}

function normalizeHex(h: string) {
  if (h.length === 4) {
    // #abc -> #aabbcc
    return (
      "#" +
      h
        .slice(1)
        .split("")
        .map((ch) => ch + ch)
        .join("")
    );
  }
  return h;
}

function hexToRgb(h: string) {
  h = normalizeHex(h);
  const [, r, g, b] =
    h.match(/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/) || [];
  return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
}

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
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

const rgb = computed(() => {
  try {
    return hexToRgb(hex.value);
  } catch {
    return { r: 0, g: 0, b: 0 };
  }
});

const rgbStr = computed(
  () => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`
);
const hslStr = computed(() => {
  const { h, s, l } = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b);
  return `hsl(${h}, ${s}%, ${l}%)`;
});

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function copyHex() {
  copy(hex.value);
}
</script>
