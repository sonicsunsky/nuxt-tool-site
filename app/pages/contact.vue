<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <Head>
      <Title>联系我们 - 开发者工具箱</Title>
      <Meta
        name="description"
        content="联系开发者工具箱团队：提供建议、反馈工具问题、进行商务合作或咨询开源贡献。我们重视您的每一条信息。"
      />
    </Head>

    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        💬 联系我们：合作、反馈与建议
      </h1>
      <p class="text-lg text-gray-600 max-w-3xl mx-auto">
        我们非常重视用户的每一条反馈。无论您有工具的使用建议、新工具的需求、商务合作意向或开源贡献，都欢迎通过以下方式与我们取得联系。
      </p>
    </header>

    <UCard class="mb-8">
      <template #header>
        <h2 class="text-2xl font-semibold flex items-center gap-2">
          <UIcon name="i-heroicons-envelope" class="text-primary text-3xl" />
          主要联系方式
        </h2>
      </template>

      <ul class="list-none space-y-5 text-lg">
        <li class="flex items-center gap-4">
          <UIcon name="i-heroicons-at-symbol" class="text-xl text-blue-500" />
          <div>
            <span class="font-medium"
              >邮箱反馈 (推荐用于商务合作与一般咨询):</span
            >
            <div class="mt-1">
              <a
                href="mailto:sonicsunsky@gmail.com"
                class="text-blue-600 hover:underline font-mono text-xl"
              >
                sonicsunsky@gmail.com
              </a>
            </div>
          </div>
        </li>
        <li class="flex items-center gap-4">
          <UIcon name="i-simple-icons-github" class="text-xl text-gray-800" />
          <div>
            <span class="font-medium"
              >GitHub Issue (推荐用于工具 Bug 或功能建议):</span
            >
            <div class="mt-1">
              <UButton
                label="前往 GitHub 提交 Issue"
                to="https://github.com/sonicsunsky/nuxt-tool-site/issues"
                target="_blank"
                variant="link"
                icon="i-heroicons-arrow-top-right-on-square"
                size="xl"
                class="pl-0"
              />
            </div>
          </div>
        </li>
      </ul>
    </UCard>

    <UAlert
      icon="i-heroicons-clock"
      color="info"
      variant="subtle"
      title="我们的响应时间"
      description="我们会在收到邮件或 Issue 后的 1-3 个工作日内进行回复或处理。感谢您的耐心等待。"
      class="mb-8"
    />
  </div>
</template>

<script setup lang="ts">
// 在 Nuxt 3 中，使用 useHead 或 Head 组件处理 SEO 元信息
</script>
