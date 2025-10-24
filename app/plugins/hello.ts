//如果你注册了一个 Vue 指令，除非你只在某一端渲染时使用它，否则你必须在客户端和服务器端都注册该指令。
// 如果该指令仅在客户端有意义，你可以将其移到 ~/plugins/my-directive.client.ts，并在 ~/plugins/my-directive.server.ts 中为服务端提供一个“占位”指令
export default defineNuxtPlugin((nuxtApp) => {
  const foo = useFoo();
});
