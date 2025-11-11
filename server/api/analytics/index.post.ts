import { readBody } from "h3";
import { redis } from "~~/server/utils/redis";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = event.node.req.headers;

  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const monthKey = now.toISOString().slice(0, 7); // YYYY-MM
  const yearKey = now.toISOString().slice(0, 4); // YYYY

  const ip =
    headers["x-forwarded-for"] ||
    event.node.req.socket.remoteAddress ||
    "Unknown";

  const visitorId = body.visitorId || ip;

  // Redis Key Naming
  const pvDayKey = `analytics:pv:day:${dateKey}`;
  const pvMonthKey = `analytics:pv:month:${monthKey}`;
  const pvYearKey = `analytics:pv:year:${yearKey}`;

  const uvDayKey = `analytics:uv:day:${dateKey}`;
  const uvMonthKey = `analytics:uv:month:${monthKey}`;
  const uvYearKey = `analytics:uv:year:${yearKey}`;

  // ✅ PV 统计
  await redis.incr(pvDayKey);
  await redis.incr(pvMonthKey);
  await redis.incr(pvYearKey);

  // ✅ UV 去重统计
  if (await redis.sadd(uvDayKey, visitorId)) {
    await redis.incr(`analytics:uv:day:count:${dateKey}`);
  }
  if (await redis.sadd(uvMonthKey, visitorId)) {
    await redis.incr(`analytics:uv:month:count:${monthKey}`);
  }
  if (await redis.sadd(uvYearKey, visitorId)) {
    await redis.incr(`analytics:uv:year:count:${yearKey}`);
  }

  const log = {
    timestamp: now.toISOString(),
    ip,
    country: headers["cf-ipcountry"] || "Unknown",
    path: body.path,
    referrer: body.referrer,
    visitorId,
    userAgent: headers["user-agent"],
    screen: body.screen,
  };

  // console.log("Analytics Log:", log);

  return { success: true };
});
