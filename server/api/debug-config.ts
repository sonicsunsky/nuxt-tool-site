export default defineEventHandler((event) => {
  console.log("DEBUG headers:", event.node.req.headers);
  const host =
    event.node.req.headers["x-forwarded-host"] ||
    event.node.req.headers["host"] ||
    "";
  const proto =
    event.node.req.headers["x-forwarded-proto"] ||
    event.node.req.headers["x-forwarded-protocol"] ||
    "https";
  return { siteUrl: host ? `${proto}://${host}` : "" };
});
