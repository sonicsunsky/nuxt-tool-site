import { readBody } from "h3";
import { redis } from "~~/server/utils/redis";

// 定义 TTL（过期时间，单位：秒）
// 日统计保留 90 天
const DAY_TTL = 90 * 24 * 60 * 60;
// 月统计保留 3 年
const MONTH_TTL = 3 * 365 * 24 * 60 * 60;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = event.node.req.headers;

  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const monthKey = now.toISOString().slice(0, 7); // YYYY-MM
  const yearKey = now.toISOString().slice(0, 4); // YYYY

  // 尝试获取客户端 IP，优先使用 CDN/代理转发的 IP
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

  // ✅ PV 统计和 TTL (使用 MULTI 批量发送，优化性能)
  // INCR 和 EXPIRE 命令打包在一个请求中
  await redis
    .multi()
    .incr(pvDayKey)
    .expire(pvDayKey, DAY_TTL)
    .incr(pvMonthKey)
    .expire(pvMonthKey, MONTH_TTL)
    .incr(pvYearKey)
    .exec();

  // ✅ UV 去重统计
  // 使用 SADD 进行去重，不再使用独立的 INCR 计数键，
  // 确保 UV 统计值始终与 Set 集合大小一致。

  // 日 UV
  await redis.sadd(uvDayKey, visitorId);
  await redis.expire(uvDayKey, DAY_TTL); // 设置过期时间

  // 月 UV
  await redis.sadd(uvMonthKey, visitorId);
  await redis.expire(uvMonthKey, MONTH_TTL); // 设置过期时间

  // 年 UV (不设置 TTL，长期保留)
  await redis.sadd(uvYearKey, visitorId);

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
