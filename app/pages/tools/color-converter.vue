<template>
  <div class="max-w-4xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-center mb-4">
      🎨 颜色转换与调节工具（Hex ↔ RGB ↔ HSL）
    </h1>
    <p class="text-gray-600 text-center mb-10">
      支持 Hex、RGB、HSL 色值相互转换，实时颜色预览、滑块调节与一键复制。
    </p>

    <!-- 工具简介 -->
    <UCard class="mb-10">
      <h2 class="text-xl font-semibold mb-2">工具简介</h2>
      <p>
        本工具可实时在不同颜色格式之间转换，并提供直观的可视化预览与 HSL
        滑块调节功能，适用于 UI 调色、前端开发等场景。
      </p>
    </UCard>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- 输入与控制 -->
      <UCard>
        <div class="space-y-5">
          <!-- HEX -->
          <div>
            <label class="font-semibold">🎨 颜色选择 / Hex 输入</label>
            <div class="flex items-center gap-3 mt-2">
              <input
                type="color"
                v-model="hex"
                class="w-12 h-10 rounded cursor-pointer border"
              />
              <UInput
                v-model="hex"
                @input="onHexTextInput"
                placeholder="#1a73e8"
                class="w-40"
              />
              <UButton icon="i-heroicons-clipboard" size="sm" @click="copy(hex)"
                >复制</UButton
              >
              <UButton
                icon="i-heroicons-arrows-right-left"
                size="sm"
                color="neutral"
                @click="randomColor"
                >随机</UButton
              >
            </div>
          </div>

          <!-- RGB -->
          <div>
            <h3 class="font-semibold text-sm mb-1">RGB 数值调节</h3>
            <div class="grid grid-cols-3 gap-2 text-sm">
              <UInput
                type="number"
                v-model.number="r"
                min="0"
                max="255"
                @input="syncFromRgb"
                placeholder="R"
              />
              <UInput
                type="number"
                v-model.number="g"
                min="0"
                max="255"
                @input="syncFromRgb"
                placeholder="G"
              />
              <UInput
                type="number"
                v-model.number="b"
                min="0"
                max="255"
                @input="syncFromRgb"
                placeholder="B"
              />
            </div>
          </div>

          <!-- HSL -->
          <div>
            <h3 class="font-semibold text-sm mb-2">HSL 滑块调节</h3>
            <div class="space-y-2">
              <div>
                <label class="text-xs">色相 (Hue)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  v-model.number="hsl.h"
                  @input="syncFromHsl"
                  class="w-full accent-red-400"
                />
              </div>
              <div>
                <label class="text-xs">饱和度 (Saturation)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  v-model.number="hsl.s"
                  @input="syncFromHsl"
                  class="w-full accent-green-400"
                />
              </div>
              <div>
                <label class="text-xs">亮度 (Lightness)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  v-model.number="hsl.l"
                  @input="syncFromHsl"
                  class="w-full accent-blue-400"
                />
              </div>
            </div>
          </div>

          <!-- 格式展示 -->
          <div class="mt-4 border-t pt-3 text-sm space-y-2 font-medium">
            <div class="flex items-center justify-between">
              <span>HEX: {{ hex }}</span>
              <UButton size="xs" variant="soft" @click="copy(hex)"
                >复制</UButton
              >
            </div>
            <div class="flex items-center justify-between">
              <span>RGB: {{ rgbStr }}</span>
              <UButton size="xs" variant="soft" @click="copy(rgbStr)"
                >复制</UButton
              >
            </div>
            <div class="flex items-center justify-between">
              <span>HSL: {{ hslStr }}</span>
              <UButton size="xs" variant="soft" @click="copy(hslStr)"
                >复制</UButton
              >
            </div>
          </div>
        </div>
      </UCard>

      <!-- 颜色预览 -->
      <UCard>
        <div class="flex flex-col items-center">
          <div
            :style="{
              background: hex,
              color: textColor,
            }"
            class="w-56 h-56 rounded-xl border shadow flex items-center justify-center text-xl font-bold transition-all duration-300"
          >
            {{ hex.toUpperCase() }}
          </div>
          <div class="mt-3 text-gray-600 text-sm">实时颜色预览</div>
          <div class="mt-3 text-sm text-gray-500">
            明度: {{ hsl.l }}% ｜ 色相: {{ hsl.h }}° ｜ 推荐文字色:
            <span :style="{ color: textColor }">{{ textColor }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";

const hex = ref("#1a73e8");
const r = ref(26); // 初始化和 hex 一致
const g = ref(115);
const b = ref(232);
const hsl = reactive({ h: 217, s: 85, l: 51 }); // 初始化与 hex 对应

onMounted(() => {
  // 保证初始值一致
  try {
    normalizeAndSyncHex(hex.value);
  } catch {
    syncFromRgb();
  }
});

/* ---------------- 辅助函数 ---------------- */
function normalizeHexStr(h: string) {
  if (!h) return "#000000";
  h = h.trim();
  if (!h.startsWith("#")) h = "#" + h;
  if (/^#([0-9a-fA-F]{3})$/.test(h)) {
    // #abc -> #aabbcc
    const s = h.slice(1).split("");
    return (
      "#" +
      s
        .map((c) => c + c)
        .join("")
        .toLowerCase()
    );
  }
  if (/^#([0-9a-fA-F]{6})$/.test(h)) {
    return h.toLowerCase();
  }
  return "#000000";
}

function clampInt(v: number, min = 0, max = 255) {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, Math.round(v)));
}

function toHexComponent(n: number) {
  return clampInt(n).toString(16).padStart(2, "0");
}

/* ---------------- HEX ↔ RGB ---------------- */
function normalizeAndSyncHex(h: string) {
  const hn = normalizeHexStr(h);
  hex.value = hn;
  // parse
  const [, rr, gg, bb] =
    hn.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i) || [];
  if (rr && gg && bb) {
    r.value = parseInt(rr, 16);
    g.value = parseInt(gg, 16);
    b.value = parseInt(bb, 16);
    syncToHsl();
  }
}

function onHexTextInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  const hn = normalizeHexStr(v);
  // only update when valid 6-digit or 3-digit provided; keep allowing editing but normalize
  if (
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v) ||
    /^#([0-9a-fA-F]{6})$/.test(hn)
  ) {
    normalizeAndSyncHex(v);
  } else {
    // update hex visually but don't break parsing
    hex.value = v;
  }
}

function syncFromRgb() {
  // clamp & round then update hex & hsl
  r.value = clampInt(r.value);
  g.value = clampInt(g.value);
  b.value = clampInt(b.value);
  hex.value =
    "#" +
    toHexComponent(r.value) +
    toHexComponent(g.value) +
    toHexComponent(b.value);
  syncToHsl();
}

/* ---------------- RGB ↔ HSL ---------------- */
function rgbToHsl(rr: number, gg: number, bb: number) {
  let r1 = rr / 255;
  let g1 = gg / 255;
  let b1 = bb / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r1:
        h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
        break;
      case g1:
        h = (b1 - r1) / d + 2;
        break;
      case b1:
        h = (r1 - g1) / d + 4;
        break;
    }
    h = h * 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  // expects h in [0,360], s,l in [0,100]
  const s1 = s / 100;
  const l1 = l / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const hh = ((h % 360) + 360) % 360;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = l1 - c / 2;
  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (0 <= hh && hh < 60) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (60 <= hh && hh < 120) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (120 <= hh && hh < 180) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (180 <= hh && hh < 240) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (240 <= hh && hh < 300) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function syncToHsl() {
  const { h: hh, s: ss, l: ll } = rgbToHsl(r.value, g.value, b.value);
  hsl.h = hh;
  hsl.s = ss;
  hsl.l = ll;
}

function syncFromHsl() {
  // ensure bounds
  hsl.h = ((Number(hsl.h) || 0) + 360) % 360;
  hsl.s = Math.min(100, Math.max(0, Math.round(Number(hsl.s) || 0)));
  hsl.l = Math.min(100, Math.max(0, Math.round(Number(hsl.l) || 0)));

  const { r: rr, g: gg, b: bb } = hslToRgb(hsl.h, hsl.s, hsl.l);
  r.value = rr;
  g.value = gg;
  b.value = bb;
  hex.value =
    "#" + toHexComponent(rr) + toHexComponent(gg) + toHexComponent(bb);
}

/* ---------------- 其他 ---------------- */
const rgbStr = computed(() => `rgb(${r.value}, ${g.value}, ${b.value})`);
const hslStr = computed(() => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
const textColor = computed(() => (hsl.l > 60 ? "#000000" : "#ffffff"));

function randomColor() {
  const rand = () => Math.floor(Math.random() * 256);
  r.value = rand();
  g.value = rand();
  b.value = rand();
  syncFromRgb();
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    // useToast exists in your project—call it if available
    try {
      useToast().add({ title: "已复制到剪贴板", color: "success" });
    } catch {
      // fallback
      // eslint-disable-next-line no-console
      console.log("copied:", text);
    }
  } catch {
    alert("复制失败");
  }
}
</script>

<style scoped>
/* 微调样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.15),
    rgba(59, 130, 246, 0.05)
  );
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
