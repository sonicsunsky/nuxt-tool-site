// utils/seo.ts
import { useNormalizedSeoMap, type ToolSeoItem } from "./useToolSeo";

export const buildSeoData = (
  path: string,
  lang: "zh" | "en",
  siteUrl: string,
  siteName: string,
  defaultOgImage?: string
) => {
  const normalizedSeoMap = useNormalizedSeoMap();
  const item: ToolSeoItem | undefined = normalizedSeoMap[path];
  const fallback = {
    title: siteName,
    description: `${siteName} – 一站式开发者在线工具集合。`,
    keywords: `${siteName},在线工具`,
  };

  const data = item ? item[lang] ?? item["zh"] : fallback;

  const title = data.title ?? fallback.title;
  const description = data.description ?? fallback.description;
  const ogTitle = data.ogTitle ?? title;
  const ogDescription = data.ogDescription ?? description;
  const keywords = data.keywords ?? fallback.keywords;
  const canonical = item?.[lang]?.canonical ?? `${siteUrl}${path}`;
  const ogImage = `${siteUrl}/images/og-cover.jpg?title=${encodeURIComponent(
    title
  )}${defaultOgImage ? `&fallback=${encodeURIComponent(defaultOgImage)}` : ""}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: canonical,
      name: title,
      description,
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: title,
      description,
      url: canonical,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  return { title, description, keywords, canonical, ogImage, jsonLd };
};
