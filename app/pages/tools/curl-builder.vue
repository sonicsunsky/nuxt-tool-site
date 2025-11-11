<template>
  <div class="max-w-5xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-4">cURL / HTTP 请求构建器</h1>
    <p class="text-gray-600 mb-10">
      在线构建并测试 cURL 命令，支持 GET / POST / JSON Body / Headers 自动生成。
    </p>

    <!-- 请求信息 -->
    <UCard class="mb-8">
      <div>
        <label class="font-medium mr-4">请求 URL</label>
        <UInput
          v-model="url"
          placeholder="https://api.example.com/v1/demo"
          class="mt-1 w-80"
        />

        <!-- Method -->
        <div class="mt-4">
          <label class="font-medium mr-4">请求方法</label>
          <USelect v-model="method" :items="methods" class="w-80 mt-1" />
        </div>

        <!-- Headers -->
        <div class="mt-6">
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
          <UButton variant="soft" size="sm" @click="addHeader"
            >+ 添加 Header</UButton
          >
        </div>

        <!-- Body -->
        <div v-if="method !== 'GET'" class="mt-6">
          <label class="font-medium mr-4">请求 Body (JSON)</label>
          <UTextarea
            v-model="body"
            rows="6"
            class="mt-1"
            placeholder='{"name":"ChatGPT"}'
          />

          <div class="flex gap-2 mt-2">
            <UButton variant="soft" size="sm" @click="formatJson"
              >格式化 JSON</UButton
            >
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <UButton @click="build" color="secondary">生成 cURL</UButton>
          <UButton @click="execute" :disabled="!url" color="primary"
            >测试请求</UButton
          >
        </div>
      </div>
    </UCard>

    <!-- cURL 显示 -->
    <UCard class="mb-8">
      <h3 class="font-semibold mb-2">生成的 cURL 命令</h3>
      <pre
        class="bg-gray-100 p-3 rounded h-48 overflow-auto text-sm whitespace-pre-wrap"
      >
        {{ curl || "# 输入信息以生成 cURL" }}
      </pre>
      <UButton size="sm" class="mt-2" :disabled="!curl" @click="copyCurl"
        >📋 复制 cURL</UButton
      >
    </UCard>

    <!-- 响应结果 -->
    <UCard v-if="response">
      <h3 class="font-semibold mb-3">请求响应结果</h3>
      <div class="text-sm text-gray-600 mb-2">
        ✅ 状态：{{ status }} ｜ ⏱ {{ time }} ms
      </div>
      <pre
        class="bg-gray-50 p-3 rounded h-64 overflow-auto text-xs whitespace-pre-wrap"
        >{{ response }}
      </pre>
      <UButton size="sm" class="mt-2" @click="copyResponse"
        >复制响应内容</UButton
      >
    </UCard>
  </div>
</template>

<script setup lang="ts">
const url = ref("");
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const method = ref("GET");
const headers = ref([{ key: "", value: "" }]);
const body = ref("");
const curl = ref("");

const response = ref("");
const status = ref("");
const time = ref(0);

function addHeader() {
  headers.value.push({ key: "", value: "" });
}
function removeHeader(i: number) {
  headers.value.splice(i, 1);
}
function escapeShell(s: string) {
  return `'${s.replace(/'/g, `'\"'\"'`)}'`;
}

function build() {
  const parts = [`curl -i -X ${method.value}`];
  headers.value.forEach(
    (h) => h.key && parts.push(`-H ${escapeShell(`${h.key}: ${h.value}`)}`)
  );
  if (method.value !== "GET" && body.value.trim()) {
    try {
      JSON.parse(body.value);
    } catch {
      alert("Body 不是合法 JSON");
    }
    parts.push(`-d ${escapeShell(body.value.trim())}`);
  }
  parts.push(escapeShell(url.value));
  curl.value = parts.join(" \\\n  ");
}

function formatJson() {
  try {
    body.value = JSON.stringify(JSON.parse(body.value), null, 2);
  } catch {
    alert("JSON 格式不正确");
  }
}

async function copyCurl() {
  await navigator.clipboard.writeText(curl.value);
  alert("✅ 已复制 cURL");
}

async function copyResponse() {
  await navigator.clipboard.writeText(response.value);
  alert("✅ 已复制响应内容");
}

async function execute() {
  const start = performance.now();
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
  }
  time.value = Math.round(performance.now() - start);
}
</script>
