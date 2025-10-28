<template>
  <div>
    <h2 class="text-lg font-bold mb-4">cURL / HTTP 请求构建器</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="font-medium">请求 URL</label>
        <input
          v-model="url"
          class="w-full border p-2 rounded mt-1"
          placeholder="https://api.example.com/v1/items"
        />

        <label class="font-medium mt-3">方法</label>
        <select v-model="method" class="w-40 border p-2 rounded mt-1">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>

        <div class="mt-3">
          <h4 class="font-medium">Headers</h4>
          <div v-for="(h, idx) in headers" :key="idx" class="flex gap-2 mt-2">
            <input
              v-model="h.key"
              placeholder="Header 名称"
              class="border p-2 rounded w-1/2"
            />
            <input
              v-model="h.value"
              placeholder="Header 值"
              class="border p-2 rounded flex-1"
            />
            <button
              @click="removeHeader(idx)"
              class="px-3 rounded bg-red-500 text-white"
            >
              删除
            </button>
          </div>
          <button @click="addHeader" class="mt-2 px-3 py-1 border rounded">
            添加 Header
          </button>
        </div>

        <div v-if="method !== 'GET'" class="mt-4">
          <h4 class="font-medium">请求 Body (JSON)</h4>
          <textarea
            v-model="body"
            rows="6"
            class="w-full border p-2 rounded mt-1"
            placeholder='{"name":"value"}'
          />
        </div>

        <div class="mt-3 flex gap-2">
          <button
            @click="build"
            class="bg-blue-600 text-white px-4 py-2 rounded"
          >
            生成 cURL
          </button>
          <button
            @click="copyCurl"
            :disabled="!curl"
            class="bg-green-600 text-white px-4 py-2 rounded"
          >
            复制
          </button>
        </div>
      </div>

      <div>
        <label class="font-medium">生成的 cURL</label>
        <pre class="bg-gray-50 p-3 rounded h-64 overflow-auto text-sm">{{
          curl || "# 点击生成"
        }}</pre>

        <div class="mt-4">
          <label class="font-medium">命令测试（可选）</label>
          <div class="text-sm text-gray-600 mt-2">
            你可以将生成的 cURL 粘贴到终端执行，或在 Postman / HTTPie 中使用。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const url = ref("");
const method = ref<"GET" | "POST" | "PUT" | "PATCH" | "DELETE">("GET");
const headers = ref<{ key: string; value: string }[]>([]);
const body = ref("");
const curl = ref("");

function addHeader() {
  headers.value.push({ key: "", value: "" });
}
function removeHeader(i: number) {
  headers.value.splice(i, 1);
}

function escapeShell(s: string) {
  // 简单单引号包裹并转义单引号：' -> '"'"'
  return `'${s.replace(/'/g, `'\"'\"'`)}'`;
}

function build() {
  if (!url.value) {
    alert("请输入 URL");
    return;
  }
  let parts: string[] = ["curl -i"];
  parts.push(`-X ${method.value}`);

  headers.value.forEach((h) => {
    if (h.key.trim()) parts.push(`-H ${escapeShell(`${h.key}: ${h.value}`)}`);
  });

  if (method.value !== "GET" && body.value.trim()) {
    // 尝试美化 JSON 并用单引号包裹
    let b = body.value;
    try {
      b = JSON.stringify(JSON.parse(body.value));
    } catch {}
    parts.push(`-d ${escapeShell(b)}`);
  }

  parts.push(escapeShell(url.value));
  curl.value = parts.join(" \\\n  ");
}

function copyCurl() {
  if (!curl.value) return;
  navigator.clipboard.writeText(curl.value).then(() => alert("已复制 cURL"));
}
</script>
