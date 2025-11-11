export default defineNitroPlugin((nitroApp) => {
  //   console.log("Nitro plugin: ", nitroApp);
  //   return;
  nitroApp.hooks.hook("request", (event) => {
    // console.log("Nitro plugin------------------: ", event.node.req.headers);
    const reqHost =
      event.node.req.headers["x-forwarded-host"] ||
      event.node.req.headers["host"];

    if (!reqHost) return;

    const protocol = event.node.req.headers["x-forwarded-proto"] || "https";
    const runtimeConfig = useRuntimeConfig();
    console.log("host:", reqHost, "proto:", protocol);
    runtimeConfig.public.siteUrl = `${protocol}://${reqHost}`;
    process.env.NUXT_PUBLIC_SITE_URL = `${protocol}://${reqHost}`;
  });
});
