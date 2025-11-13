<template>
  <div class="tool-container">
    <h1 class="tool-title">🌐 cURL / HTTP 请求构建器</h1>
    <p class="tool-desc">
      在线构建并测试 HTTP 请求命令，支持
      <strong>GET / POST / JSON Body / Headers</strong>
      自动生成与执行，快速验证接口响应。
    </p>

    <!-- 工具介绍 -->
    <section class="info-block">
      <h3 class="info-title">工具功能简介</h3>
      <p>
        本工具用于快速生成并测试 HTTP 请求的
        <strong>cURL 命令</strong>，可自定义
        <strong>Headers、Body、请求方法</strong>，
        支持一键复制、在线发送请求并查看响应内容。
      </p>
      <p class="mt-2">
        💡 常用于：接口测试、前后端调试、API 调用验证、在线生成 cURL 命令。
      </p>
    </section>

    <!-- 请求设置 -->
    <UCard class="mt-8">
      <div class="space-y-6">
        <!-- URL -->
        <div>
          <label class="font-semibold mr-4">请求 URL</label>
          <UInput
            v-model="url"
            placeholder="https://api.example.com/v1/demo"
            class="mt-1 w-full"
          />
        </div>

        <!-- Method -->
        <div>
          <label class="font-semibold mr-4">请求方法</label>
          <USelect v-model="method" :items="methods" class="mt-1 w-48" />
        </div>

        <!-- Headers -->
        <div>
          <h3 class="font-semibold mb-2">Headers</h3>
          <div v-for="(h, i) in headers" :key="i" class="flex gap-2 mb-2">
            <UInput placeholder="Key" v-model="h.key" />
            <UInput placeholder="Value" v-model="h.value" />
            <UButton
              icon="i-heroicons-trash"
              color="error"
              variant="soft"
              @click="removeHeader(i)"
            />
          </div>

          <UButton variant="soft" size="sm" @click="addHeader">
            + 添加 Header
          </UButton>
        </div>

        <!-- Body -->
        <div v-if="method !== 'GET'">
          <label class="font-semibold mr-4">请求 Body (JSON)</label>
          <UTextarea
            v-model="body"
            rows="6"
            class="mt-1 w-full"
            placeholder='{"name":"ChatGPT"}'
          />
          <div class="flex gap-2 mt-2">
            <UButton variant="soft" size="sm" @click="formatJson">
              格式化 JSON
            </UButton>
          </div>
        </div>

        <!-- 按钮区 -->
        <div class="flex flex-wrap gap-3 mt-4">
          <UButton color="secondary" @click="build">生成 cURL</UButton>
          <UButton
            color="primary"
            :loading="isLoading"
            :disabled="!url"
            @click="execute"
          >
            测试请求
          </UButton>
          <UButton color="neutral" variant="soft" @click="resetAll"
            >重置</UButton
          >
        </div>
      </div>
    </UCard>

    <!-- cURL 输出 -->
    <UCard class="mt-8">
      <h3 class="font-semibold mb-2">生成的 cURL 命令</h3>
      <pre
        class="bg-gray-100 p-3 rounded text-sm overflow-auto whitespace-pre-wrap h-48"
        >{{ curl || "# 输入请求信息后生成 cURL 命令" }}
      </pre>
      <UButton size="sm" class="mt-2" :disabled="!curl" @click="copyCurl"
        >📋 复制命令</UButton
      >
    </UCard>

    <!-- 响应结果 -->
    <UCard v-if="response" class="mt-8">
      <h3 class="font-semibold mb-3">请求响应结果</h3>
      <div class="text-sm text-gray-600 mb-2">
        ✅ 状态：{{ status }} ｜ ⏱ {{ time }} ms
      </div>
      <pre
        class="bg-gray-50 p-3 rounded text-xs overflow-auto whitespace-pre-wrap h-64"
        >{{ response }}
      </pre>
      <UButton size="sm" class="mt-2" @click="copyResponse"
        >📄 复制响应内容</UButton
      >
    </UCard>

    <p v-else class="text-center text-gray-500 mt-10 text-sm">
      🔍 输入请求地址并点击“测试请求”查看结果
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

const url = ref("");
const method = ref("GET");
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const headers = ref([{ key: "", value: "" }]);
const body = ref("");
const curl = ref("");

const response = ref("");
const status = ref("");
const time = ref(0);
const isLoading = ref(false);

const { copy: copyToClipboard } = useClipboard();

function addHeader() {
  headers.value.push({ key: "", value: "" });
}
function removeHeader(i: number) {
  headers.value.splice(i, 1);
}
function resetAll() {
  url.value = "";
  method.value = "GET";
  headers.value = [{ key: "", value: "" }];
  body.value = "";
  curl.value = "";
  response.value = "";
  status.value = "";
  time.value = 0;
}

/** 转义 shell 参数 */
function escapeShell(s: string) {
  return `'${s.replace(/'/g, `'\"'\"'`)}'`;
}

/** 构建 cURL 命令 */
function build() {
  if (!url.value) {
    window.$toast?.error?.("请输入请求 URL");
    return;
  }

  const parts = [`curl -i -X ${method.value}`];
  headers.value.forEach(
    (h) => h.key && parts.push(`-H ${escapeShell(`${h.key}: ${h.value}`)}`)
  );

  if (method.value !== "GET" && body.value.trim()) {
    try {
      JSON.parse(body.value);
      parts.push(`-d ${escapeShell(body.value.trim())}`);
    } catch {
      window.$toast?.error?.("Body 不是合法的 JSON");
      return;
    }
  }

  parts.push(escapeShell(url.value));
  curl.value = parts.join(" \\\n  ");
}

/** 格式化 JSON Body */
function formatJson() {
  try {
    body.value = JSON.stringify(JSON.parse(body.value), null, 2);
    window.$toast?.success?.("✅ JSON 已格式化");
  } catch {
    window.$toast?.error?.("JSON 格式不正确");
  }
}

/** 复制命令 */
async function copyCurl() {
  await copyToClipboard(curl.value);
  window.$toast?.success?.("📋 已复制 cURL 命令");
}

/** 复制响应 */
async function copyResponse() {
  await copyToClipboard(response.value);
  window.$toast?.success?.("📄 已复制响应内容");
}

/** 执行请求 */
async function execute() {
  if (!url.value) {
    window.$toast?.error?.("请输入请求 URL");
    return;
  }

  const start = performance.now();
  isLoading.value = true;
  response.value = "";

  try {
    const res = await fetch(url.value, {
      method: method.value,
      headers: Object.fromEntries(
        headers.value.filter((h) => h.key).map((h) => [h.key, h.value])
      ),
      body: method.value !== "GET" ? body.value || undefined : undefined,
    });

    status.value = `${res.status} ${res.statusText}`;
    response.value = await res.text();
  } catch (err) {
    response.value = `❌ 请求失败：${err}`;
  } finally {
    time.value = Math.round(performance.now() - start);
    isLoading.value = false;
  }
}
</script>

<style scoped>
.tool-container {
  max-width: 1000px;
  margin: auto;
  padding: 2rem;
}

.tool-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.tool-desc {
  color: #555;
  margin-bottom: 1.5rem;
}

.info-block {
  margin-top: 1.5rem;
  padding: 1.2rem;
  background: #f8fafc;
  border-radius: 12px;
  line-height: 1.7;
}
.info-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
</style>
