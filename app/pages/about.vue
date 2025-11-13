<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <Head>
      <Title>关于我们 - 开发者工具箱</Title>
      <Meta
        name="description"
        content="了解开发者工具箱的创建理念、团队承诺和安全保障。我们致力于提供免费、安全、高效的在线工具。"
      />
    </Head>

    <header class="text-center mb-12">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-3">
        🚀 关于开发者工具箱
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        为全球开发者、设计师和数字创作者提供实用、高效、安全的在线工具服务。
      </p>
    </header>

    <div class="space-y-12">
      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold flex items-center gap-2">
            <UIcon
              name="i-heroicons-light-bulb"
              class="text-blue-500 text-3xl"
            />
            我们的理念与愿景
          </h2>
        </template>
        <p class="text-lg leading-relaxed text-gray-700">
          我们深知在日常开发和创作中，重复性的小任务会消耗大量时间。开发者工具箱的使命，就是通过提供**便捷、零门槛**的在线工具，解决这些“痛点”，帮助用户**节省每一分钟时间**，将精力集中在更有价值的创造上。
        </p>
        <p class="mt-4 text-gray-700 font-medium">
          我们的愿景是成为面向所有互联网从业者的**在线生产力中心**。
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold flex items-center gap-2">
            <UIcon
              name="i-heroicons-shield-check"
              class="text-green-500 text-3xl"
            />
            核心承诺与安全保障
          </h2>
        </template>
        <ul class="list-none space-y-4">
          <li class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-lock-closed"
              class="text-xl text-green-600 mt-1 flex-shrink-0"
            />
            <div>
              <p class="font-bold">数据安全与隐私</p>
              <p class="text-gray-700">
                本站所有核心工具（如 Base64、JSON
                格式化、正则测试等）均采用**纯本地浏览器技术**运行。我们承诺：**用户输入的所有数据不会上传至我们的服务器**。
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-gift"
              class="text-xl text-green-600 mt-1 flex-shrink-0"
            />
            <div>
              <p class="font-bold">永久免费与零门槛</p>
              <p class="text-gray-700">
                所有功能对所有用户完全免费开放，无需注册、无需付费，即开即用。
              </p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <UIcon
              name="i-heroicons-arrows-right-left"
              class="text-xl text-green-600 mt-1 flex-shrink-0"
            />
            <div>
              <p class="font-bold">持续维护与更新</p>
              <p class="text-gray-700">
                项目基于最新技术栈构建，确保工具的性能与兼容性，并长期持续开发和维护。
              </p>
            </div>
          </li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-2xl font-semibold flex items-center gap-2">
            <UIcon
              name="i-heroicons-code-bracket-square"
              class="text-purple-500 text-3xl"
            />
            参与共建与联系
          </h2>
        </template>
        <p class="text-lg leading-relaxed text-gray-700 mb-4">
          本项目是一个开源项目。我们深信开源的力量，欢迎开发者通过 GitHub 提交
          Pull Request 或反馈建议，共同完善工具内容。
        </p>
        <div class="flex flex-wrap gap-4">
          <UButton
            icon="i-heroicons-document-text"
            label="查看隐私政策"
            to="/privacy"
            variant="outline"
            color="primary"
            size="lg"
          />
          <UButton
            icon="i-heroicons-at-symbol"
            label="联系我们"
            to="/contact"
            variant="solid"
            color="primary"
            size="lg"
          />
          <!-- <UButton
            icon="i-simple-icons-github"
            label="项目源代码 (GitHub)"
            href="https://github.com/sonicsunsky/nuxt-tool-site"
            target="_blank"
            variant="ghost"
            size="lg"
          /> -->
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// 在 Nuxt 3 中，使用 useHead 或 Head 组件处理 SEO 元信息
</script>
