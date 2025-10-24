export default defineNuxtPlugin((nuxtApp) => {
  //入插件的唯一参数是 nuxtApp,你可以在 Nuxt 插件中使用 composables 以及 utils
  //你可以使用 onErrorCaptured 钩子来捕获 Vue 错误。
  //此外，Nuxt 提供了一个 vue:error 钩子，如果任何错误向上冒泡到顶层，该钩子将被调用。
  //如果你在使用错误上报框架，可以通过 vueApp.config.errorHandler 提供一个全局处理器。它会接收所有 Vue 错误，即使这些错误已被处理。
  //请注意，vue:error 钩子是基于 onErrorCaptured 生命周期钩子
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.log(error, instance, info);
    // handle error, e.g. report to a service
  };

  // Also possible
  //   nuxtApp.hook("vue:error", (error, instance, info) => {
  //     // handle error, e.g. report to a service
  //   });
});
