export default defineNuxtPlugin(() => {
  if (process.client) {
    // const script = document.createElement("script");
    // script.async = true;
    // script.src =
    //   "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    // script.setAttribute("data-ad-client", "ca-pub-xxxxxxxxxxxxxx"); // 替换成你的 AdSense ID
    // document.head.appendChild(script);
  }
});
