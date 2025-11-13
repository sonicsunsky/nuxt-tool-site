<template>
  <div class="space-y-6">
    <h2 class="text-lg font-bold">时间戳 ↔ 日期转换</h2>

    <!-- 工具介绍 -->
    <section class="p-6 bg-gray-50 text-gray-700 rounded-xl leading-relaxed">
      <h3 class="text-lg font-bold mb-2">时间戳转换工具介绍</h3>
      <p>
        时间戳用于表示时间点，例如 Unix 时间戳（从 1970 年起的秒数）。
        本工具支持 <b>秒级</b> 与 <b>毫秒级</b> 时间戳互转， 并支持
        <b>北京时间（UTC+8）</b> 与 <b>本地时区</b> 转换，
        方便开发者进行日志分析与调试。
      </p>
    </section>

    <!-- 输入与操作 -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- 左侧：时间戳 -->
      <div>
        <label class="font-medium">时间戳</label>
        <UInput
          v-model="timestamp"
          type="text"
          placeholder="例如：1735056000 或 1735056000000"
          class="w-full mt-1"
          icon="i-lucide-clock"
        />
        <UButton color="primary" block class="mt-3" @click="toDate">
          转换为日期
        </UButton>
      </div>

      <!-- 右侧：日期 -->
      <div>
        <label class="font-medium">日期</label>
        <UInput
          v-model="dateStr"
          type="datetime-local"
          class="w-full mt-1"
          icon="i-lucide-calendar"
        />
        <UButton color="secondary" block class="mt-3" @click="toTimestamp">
          转换为时间戳
        </UButton>
      </div>
    </div>

    <!-- 结果显示 -->
    <div class="bg-gray-100 p-4 rounded text-sm leading-relaxed">
      <p>
        当前时间戳（秒）：<b>{{ nowTs }}</b>
      </p>
      <p>
        当前时间（本地）：<b>{{ nowDate }}</b>
      </p>
      <p>
        当前时间（北京时间 UTC+8）：<b>{{ nowBeijing }}</b>
      </p>
    </div>

    <!-- 自动更新时间 -->
    <div class="text-xs text-gray-400 text-right">每秒自动刷新当前时间</div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timestamp = ref("");
const dateStr = ref("");

// 当前时间动态刷新
const nowTs = ref(dayjs().unix());
const nowDate = ref(dayjs().format("YYYY-MM-DD HH:mm:ss"));
const nowBeijing = ref(
  dayjs().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss")
);

// 每秒自动刷新当前时间
setInterval(() => {
  nowTs.value = dayjs().unix();
  nowDate.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
  nowBeijing.value = dayjs().tz("Asia/Shanghai").format("YYYY-MM-DD HH:mm:ss");
}, 1000);

// 时间戳 -> 日期
function toDate() {
  if (!timestamp.value) {
    return showToast("请输入时间戳");
  }

  let ts = Number(timestamp.value);
  if (isNaN(ts)) {
    return showToast("时间戳无效");
  }

  // 支持毫秒或秒
  if (timestamp.value.length === 13) {
    ts = ts;
  } else if (timestamp.value.length === 10) {
    ts = ts * 1000;
  } else {
    return showToast("时间戳格式错误，请输入10位或13位数字");
  }

  dateStr.value = dayjs(ts).format("YYYY-MM-DDTHH:mm");
  showToast("✅ 已转换为日期");
}

// 日期 -> 时间戳
function toTimestamp() {
  if (!dateStr.value) {
    return showToast("请输入日期时间");
  }

  const ts = dayjs(dateStr.value).valueOf();
  if (!ts) {
    return showToast("日期格式错误");
  }

  timestamp.value = String(Math.floor(ts / 1000));
  showToast("✅ 已转换为时间戳");
}

// 统一 toast 提示
function showToast(message: string) {
  const toast = useToast?.() || null;
  if (toast) {
    toast.add({
      title: message,
      color: message.includes("✅") ? "success" : "warning",
    });
  } else {
    alert(message);
  }
}
</script>
