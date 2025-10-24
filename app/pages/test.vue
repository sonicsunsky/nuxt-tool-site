<template>
  <div>
    <button>Contact</button>
  </div>
</template>

<script setup lang="ts">
//useFetch 会确保请求在服务器上发生并正确转发到浏览器。$fetch 没有这种机制，当请求仅在浏览器端发起时，使用 $fetch 更合适
//Nuxt 包含 ofetch 库，并在应用中全局自动以 $fetch 别名导入
//在组件中直接使用 $fetch 而不将其包裹在 useAsyncData 中，会导致数据被重复获取：
// 在服务端首次获取一次，然后在客户端在 hydration 期间再次获取一次，因为 $fetch 不会将服务器端的状态传递到客户端。
// 因此该请求会在两端都执行，客户端必须重新获取数据
//我们建议使用 useFetch 或者 使用 useAsyncData + $fetch，以避免在获取组件数据时发生重复获取

// During SSR data is fetched twice, once on the server and once on the client.
const dataTwice = await $fetch("/api/item");

// During SSR data is fetched only on the server side and transferred to the client.
const res = await useAsyncData("item", () => $fetch("/api/item"));

// You can also useFetch as shortcut of useAsyncData + $fetch
// const { data: data2 } = await useFetch("/api/item");

// const { data: data3 } = await useFetch("/api/data");

async function handleFormSubmit() {
  const res = await $fetch("/api/submit", {
    method: "POST",
    body: {
      // My form data
    },
  });
}

async function addTodo() {
  const todo = await $fetch("/api/todos", {
    method: "POST",
    body: {
      // My todo data
    },
  });
}
</script>
