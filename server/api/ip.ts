// server/api/ip.ts
import { lookup } from "node:dns/promises";
import { getRequestIP } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let target = query.target as string;

  let result = {
    ip: "",
    location: "",
    isp: "",
    queryType: "current_user",
    error: null as string | null,
  };

  try {
    // 1. 确定目标 IP
    if (!target) {
      const userIp = getRequestIP(event, { xForwardedFor: true });
      // 本地开发时 userIp 可能是 ::1 或 127.0.0.1，这里给个默认公网IP方便测试
      target =
        userIp === "::1" || userIp === "127.0.0.1"
          ? "114.114.114.114"
          : userIp || "";
      result.queryType = "current_user";
    } else {
      result.queryType = "search";
      // 域名解析
      if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(target)) {
        try {
          const dnsRes = await lookup(target);
          target = dnsRes.address;
        } catch (e) {
          throw new Error(`无法解析域名: ${target}`);
        }
      }
    }

    result.ip = target;

    // ==========================================
    // 核心修改：优先使用 Pconline (太平洋网络) 接口
    // ==========================================
    try {
      // Pconline 接口 (GBK编码)
      // 注意：必须用 responseType: 'arrayBuffer' 获取原始二进制数据
      const buffer = await $fetch<ArrayBuffer>(
        `http://whois.pconline.com.cn/ipJson.jsp?ip=${target}&json=true`,
        {
          responseType: "arrayBuffer",
          timeout: 3000, // 设置超时，防止阻塞
        }
      );

      // 解码 GBK
      const decoder = new TextDecoder("gbk");
      const text = decoder.decode(buffer);

      // 解析 JSON
      // Pconline 有时返回的 JSON 格式可能会带有多余空格，trim一下
      const cnData = JSON.parse(text.trim());

      if (cnData.pro || cnData.city) {
        // 成功获取数据
        const locationParts = [cnData.pro, cnData.city, cnData.region].filter(
          Boolean
        );
        // 去重 (例如：北京市 北京市 -> 北京市)
        result.location = [...new Set(locationParts)].join(" ");

        // 运营商信息通常在 addr 字段里，例如 "广东省广州市电信"
        // 我们尝试从 addr 中提取运营商，或者直接使用 addr 作为详情
        result.isp =
          cnData.addr.replace(cnData.pro, "").replace(cnData.city, "") ||
          cnData.addr;

        // 如果 Pconline 返回的是空或者 "本机地址"，说明可能查询失败，抛出错误进入 catch 走兜底
        if (!result.location.trim()) throw new Error("Empty location");

        return result; // 成功返回，结束函数
      }
    } catch (e) {
      // Pconline 失败或超时，静默失败，继续向下执行 ip-api.com 的逻辑
      console.warn("Pconline query failed, falling back to ip-api:", e);
    }

    // ==========================================
    // 兜底策略：使用 ip-api.com (原有逻辑)
    // ==========================================
    const apiUrl = `http://ip-api.com/json/${target}?lang=zh-CN`;
    const geoData: any = await $fetch(apiUrl);

    if (geoData.status === "fail") {
      throw new Error(geoData.message || "查询失败");
    }

    result.location = `${geoData.country} ${geoData.regionName} ${geoData.city}`;
    result.isp = geoData.isp || geoData.org;
  } catch (error: any) {
    result.error = error.message || "发生未知错误";
  }

  return result;
});
