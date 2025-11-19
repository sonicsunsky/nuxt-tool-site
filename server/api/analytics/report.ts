import { redis } from "~~/server/utils/redis";

/**
 * 优化后的 PV 指标获取函数：使用 MGET 批量查询 PV 数据
 * @param prefix Redis 键前缀 (例如: 'analytics:pv:day')
 * @param keys 日期/月份列表 (例如: ['2023-10-01', '2023-10-02'])
 * @returns 包含键值对的对象
 */
async function getPVMetric(prefix: string, keys: string[]) {
  // 构建所有完整的 Redis 键名
  const fullKeys = keys.map((key) => `${prefix}:${key}`);

  // 使用 MGET 一次性获取所有值，极大减少网络 RTT
  // MGET 返回一个包含所有值（或 null）的数组
  const values = await redis.mget<string[]>(...fullKeys);

  const data: any = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = values[i];
    // Redis GET 返回 null 或字符串，我们需要转换为数字
    data[key] = Number(value || 0);
  }
  return data;
}

/**
 * UV 指标获取函数：使用 SCARD 逐个查询 UV Set 的大小
 * @param prefix Redis 键前缀 (例如: 'analytics:uv:day')
 * @param keys 日期/月份列表 (例如: ['2023-10-01', '2023-10-02'])
 * @returns 包含键值对的对象
 */
async function getUVMetric(prefix: string, keys: string[]) {
  const data: any = {};
  // 注意：虽然 SCARD 也可以用 pipeline 批量执行，但 Upstash/RESTful API
  // 的限制可能导致管道操作略有不同。最可靠且保证数据一致性的方式是直接 SCARD。
  // 由于 UV 的获取通常比 PV 复杂（需要 COUNT/SCARD 而不是简单的 GET），
  // 保持循环调用 SCARD 是一个安全和可读性强的选择。

  for (const key of keys) {
    const fullKey = `${prefix}:${key}`;
    // SCARD 命令返回 Set 集合中的元素数量，即 UV 值
    const count = await redis.scard(fullKey);
    data[key] = count;
  }
  return data;
}

export default defineEventHandler(async () => {
  const now = new Date();
  const thisYear = now.getFullYear();

  // 获取过去 30 天的日期 (YYYY-MM-DD)
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  // 获取过去 12 个月的月份 (YYYY-MM)
  const last12Months = [...Array(12)].map((_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  });

  const years = [thisYear.toString()];

  return {
    pv: {
      // 使用 MGET 批量获取 PV
      day: await getPVMetric("analytics:pv:day", last30Days),
      month: await getPVMetric("analytics:pv:month", last12Months),
      year: await getPVMetric("analytics:pv:year", years),
    },
    uv: {
      // 使用 SCARD 获取 UV (不再查询独立的 :count 键)
      day: await getUVMetric("analytics:uv:day", last30Days),
      month: await getUVMetric("analytics:uv:month", last12Months),
      year: await getUVMetric("analytics:uv:year", years),
    },
  };
});
