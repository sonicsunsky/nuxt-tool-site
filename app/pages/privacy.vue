<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <Head>
      <Title>隐私政策 - 开发者工具箱</Title>
      <Meta
        name="description"
        content="开发者工具箱的隐私政策：我们承诺所有工具数据均在浏览器本地处理，确保用户输入内容不会被上传或存储。"
      />
    </Head>

    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">🔒 隐私政策</h1>
      <p class="text-lg text-gray-600">最近更新日期：2025 年 11 月 14 日</p>
    </header>

    <UAlert
      icon="i-heroicons-information-circle"
      color="primary"
      variant="subtle"
      title="核心隐私承诺（请仔细阅读）"
      description="开发者工具箱的大多数核心功能（如 Base64 编解码、JSON 格式化等）均基于浏览器本地技术运行。我们承诺：您的任何输入数据，包括文本内容、文件或代码，都不会被上传到我们的服务器，也绝不会被存储或共享。"
      class="mb-8"
    />

    <div class="space-y-10 text-gray-700 leading-relaxed">
      <section>
        <h2 class="text-2xl font-semibold mb-3">1. 我们如何收集和使用信息</h2>
        <p>
          本站**不会**主动收集任何可识别您个人身份的信息
          (PII)。我们收集的信息仅限于以下非个人信息，目的是为了维护、优化网站性能和分析流量：
        </p>
        <ul class="list-disc ml-6 space-y-2">
          <li>
            <span class="font-bold">本地处理数据：</span>
            我们不存储任何您在工具中输入的文本、代码或文件内容。它们仅在您的本地设备上处理。
          </li>
          <li>
            <span class="font-bold">浏览器基础信息：</span>
            包括您的 IP
            地址、浏览器类型、设备类型、访问时间、以及从哪个网站链接到本站。这些信息用于统计网站流量和诊断技术问题。
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">2. 第三方服务与 Cookie 政策</h2>
        <p>
          我们依赖第三方服务来支持网站的运营、广告投放和流量分析。这些服务会使用
          Cookie 或类似技术收集匿名数据，以改进其服务和广告效果：
        </p>
        <ul class="list-disc ml-6 space-y-2">
          <li>
            <span class="font-bold">Google AdSense：</span>
            作为广告服务商，AdSense 使用 **DART Cookie**
            以根据您访问本站及其他网站的记录，向您投放相关广告。
            <br />您可以访问
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              class="text-blue-600 hover:underline"
              >Google 广告隐私权和条款</a
            >，并随时通过
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              class="text-blue-600 hover:underline"
              >Google 广告设置</a
            >
            退出个性化广告。
          </li>
          <li>
            <span class="font-bold">Google Analytics：</span>
            用于匿名分析用户如何使用本站，以便我们优化内容和功能。这些数据是聚合的，不能用于识别个人。
          </li>
          <li>
            <span class="font-bold">您的选择：</span>
            您可以随时在浏览器设置中手动禁用或删除
            Cookie。但这可能会影响本站或第三方服务的某些功能。
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">3. 儿童隐私保护</h2>
        <p>
          本站内容不面向 13
          岁以下儿童。如果您的年龄未达到法律规定的最低年龄，请在监护人的指导下使用本站。
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-3">4. 政策更新与疑问联系</h2>
        <p>
          本隐私政策可能因法律或服务调整不定期更新，最新更新日期将显示在页面顶部。建议您定期查看本页面以了解最新变化。
        </p>
        <p>如果您对本隐私政策有任何疑问或疑虑，请通过以下方式联系我们：</p>
        <p class="font-bold mt-2">
          Email:
          <a
            href="mailto:sonicsunsky@gmail.com"
            class="text-blue-600 hover:underline"
            >sonicsunsky@gmail.com</a
          >
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 在 Nuxt 3 中，使用 useHead 或 Head 组件处理 SEO 元信息
</script>
