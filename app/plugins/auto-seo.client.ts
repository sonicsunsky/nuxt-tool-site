// plugins/auto-seo.ts
import {
  defineNuxtPlugin,
  useRoute,
  useHead,
  useRuntimeConfig,
  watch,
} from "#imports";

import { buildSeoData } from "~/utils/seo";
import { toolsSeoMap } from "~/utils/useToolSeo";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  const siteUrl = config.siteUrl;
  const siteName = config.siteName || "开发者工具箱";
  const defaultOgImage = config.defaultOgImage;

  const route = useRoute();

  const applySeoForPath = (path: string) => {
    // normalize: try exact path first, then without trailing slash
    const tryPaths = [path, path.replace(/\/$/, "")];
    let matched = tryPaths.find((p) => !!toolsSeoMap[p]);

    // fallback: if path is root or not in map, use site defaults
    const lang: "zh" | "en" = path.startsWith("/en") ? "en" : "zh";
    const targetPath = matched ?? path; // if not matched, jsonld will use the actual path

    const { title, description, keywords, canonical, ogImage, jsonLd } =
      buildSeoData(matched ?? path, lang, siteUrl, siteName, defaultOgImage);

    useHead({
      title,
      link: [{ rel: "canonical", href: canonical }],
      meta: [
        { name: "description", content: description },
        { name: "keywords", content: keywords },

        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: ogImage },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    });
  };

  //你不需要在每个页面 useHead()。插件会在初始渲染与路由跳转时自动注入对应 meta
  // initial apply
  applySeoForPath(route.path);

  // watch route changes (works on client navigation)
  watch(
    () => route.path,
    (p) => {
      applySeoForPath(p);
    }
  );
});
