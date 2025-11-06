import { redis } from "~~/server/utils/redis";

async function getMetric(prefix: string, keys: string[]) {
  const data: any = {};
  for (const key of keys) {
    const value = await redis.get(`${prefix}:${key}`);
    data[key] = Number(value || 0);
  }
  return data;
}

export default defineEventHandler(async () => {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.toISOString().slice(0, 7);

  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  const last12Months = [...Array(12)].map((_, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  });

  const years = [thisYear.toString()];

  return {
    pv: {
      day: await getMetric("analytics:pv:day", last30Days),
      month: await getMetric("analytics:pv:month", last12Months),
      year: await getMetric("analytics:pv:year", years),
    },
    uv: {
      day: await getMetric("analytics:uv:day:count", last30Days),
      month: await getMetric("analytics:uv:month:count", last12Months),
      year: await getMetric("analytics:uv:year:count", years),
    },
  };
});
