export type Lang = "zh" | "en";

export interface ToolSeoItem {
  zh: {
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
    canonical?: string;
  };
  en: {
    title: string;
    description: string;
    keywords: string;
    ogTitle?: string;
    ogDescription?: string;
    canonical?: string;
  };
}

export const useNormalizedSeoMap = () => {
  const toolsSeoMap = useToolsSeoMap();
  const normalizedSeoMap: Record<string, ToolSeoItem> = {};
  Object.keys(toolsSeoMap).forEach((k) => {
    const key = k.startsWith("/tools/") ? k : `/tools/${k}`;
    normalizedSeoMap[key] = toolsSeoMap[k];
  });
  return normalizedSeoMap;
};

export const useToolsSeoMap = () => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl;

  return {
    "json-formatter": {
      zh: {
        title: "JSON 格式化工具 - 在线美化与压缩 JSON",
        description:
          "免费在线 JSON 格式化工具，支持 JSON 语法校验、一键压缩与美化，开发者必备数据处理工具。",
        keywords: "JSON 格式化,在线 JSON,JSON 美化,JSON 校验,开发者工具",
        ogTitle: "JSON 格式化工具",
        ogDescription: "支持 JSON 校验、一键压缩美化，提升开发效率。",
        canonical: `${siteUrl}/tools/json-formatter`,
      },
      en: {
        title: "Online JSON Formatter & Validator - Beautify & Minify JSON",
        description:
          "Free online JSON formatter and validator with syntax check, beautify and minify options. Essential developer tool.",
        keywords:
          "json formatter,json validator,pretty json,minify json,developer tools",
        ogTitle: "Online JSON Formatter",
        ogDescription: "Validate, beautify and minify JSON instantly.",
        canonical: `${siteUrl}/en/tools/json-formatter`,
      },
    },

    base64: {
      zh: {
        title: "Base64 编解码工具 - 在线 Encode/Decode",
        description:
          "在线 Base64 编码与解码工具，支持文本与文件转换，安全快速无损。",
        keywords: "Base64 编码,Base64 解码,在线工具,开发工具",
        ogTitle: "Base64 编解码工具",
        ogDescription: "支持文本/文件 Base64 转换。",
        canonical: `${siteUrl}/tools/base64`,
      },
      en: {
        title: "Base64 Encoder & Decoder - Online Tool",
        description:
          "Free Base64 encoding and decoding tool for text and files. Fast and secure online converter.",
        keywords: "base64 encoder,base64 decoder,base64 online tool",
        ogTitle: "Base64 Encoder & Decoder",
        ogDescription: "Quickly convert Base64 text and files online.",
        canonical: `${siteUrl}/en/tools/base64`,
      },
    },

    "regex-tester": {
      zh: {
        title: "正则表达式测试工具 - 实时匹配验证",
        description:
          "在线正则表达式测试工具，实时高亮匹配，支持多语言模式与常用正则示例。",
        keywords: "正则测试,在线正则,Regex Tester,开发者工具",
        ogTitle: "在线正则测试工具",
        ogDescription: "实时匹配验证正则表达式。",
        canonical: `${siteUrl}/tools/regex-tester`,
      },
      en: {
        title: "Regex Tester & Online Validator - Real-time Testing",
        description:
          "Online regex tester with real-time matching and syntax highlighting. Includes common regex examples.",
        keywords: "regex tester,regex validator,online regex tool",
        ogTitle: "Online Regex Tester",
        ogDescription: "Test regular expressions with real-time results.",
        canonical: `${siteUrl}/en/tools/regex-tester`,
      },
    },

    "jwt-parser": {
      zh: {
        title: "JWT 解析工具 - 解码 Token",
        description:
          "在线 JWT 解析与验证工具，不上传数据、确保本地解码更安全。",
        keywords: "JWT 解码,Token 解析,鉴权工具",
        ogTitle: "JWT 在线解析器",
        ogDescription: "解码 JWT Token 并查看 Payload。",
        canonical: `${siteUrl}/tools/jwt-parser`,
      },
      en: {
        title: "JWT Decoder & Token Analyzer - Secure Local Parsing",
        description:
          "Decode and inspect JWT tokens online securely with local parsing.",
        keywords: "jwt decoder,jwt analyzer,json web token tool",
        ogTitle: "Online JWT Decoder",
        ogDescription: "Decode JWT tokens and inspect content.",
        canonical: `${siteUrl}/en/tools/jwt-parser`,
      },
    },

    timestamp: {
      zh: {
        title: "时间戳转换工具 - 毫秒/日期互转",
        description:
          "在线时间戳与日期互转，支持毫秒与秒精度，快速查看当前时间戳。",
        keywords: "时间戳转换,在线时间戳,日期转换",
        ogTitle: "在线时间戳转换",
        ogDescription: "时间戳与日期格式互相转换。",
        canonical: `${siteUrl}/tools/timestamp`,
      },
      en: {
        title: "Timestamp Converter - Unix Time & Date Conversion",
        description:
          "Fast online converter between Unix timestamp and human-readable date.",
        keywords: "timestamp converter,unix time,online datetime converter",
        ogTitle: "Online Timestamp Converter",
        ogDescription: "Convert between Unix timestamp and date.",
        canonical: `${siteUrl}/en/tools/timestamp`,
      },
    },

    uuid: {
      zh: {
        title: "UUID 在线生成器 - 随机唯一标识符",
        description:
          "在线 UUID 生成工具，支持 UUID v4 等标准格式，去除连字符选项。",
        keywords: "UUID 生成,在线 UUID,随机标识符",
        ogTitle: "UUID 在线生成器",
        ogDescription: "一键生成唯一标识符。",
        canonical: `${siteUrl}/tools/uuid`,
      },
      en: {
        title: "UUID Generator Online - Random Unique Identifier",
        description:
          "Generate UUID v4 and other formats online with customization options.",
        keywords: "uuid generator,online uuid,generate uuid",
        ogTitle: "Online UUID Generator",
        ogDescription: "Create random unique identifiers instantly.",
        canonical: `${siteUrl}/en/tools/uuid`,
      },
    },

    "mock-generator": {
      zh: {
        title: "Mock 数据生成器 - 随机假数据自动生成工具",
        description:
          "快速生成姓名、地址、手机号、邮箱等随机数据，支持 API 测试模拟。",
        keywords: "Mock 数据,数据生成,在线假数据",
        ogTitle: "Mock 数据生成器",
        ogDescription: "自动生成随机测试数据。",
        canonical: `${siteUrl}/tools/mock-generator`,
      },
      en: {
        title: "Mock Data Generator - Fake Data for Testing",
        description:
          "Generate random user, email, phone, and other mock data for API testing.",
        keywords: "mock data generator,fake data,api testing tool",
        ogTitle: "Mock Data Generator",
        ogDescription: "Auto-generate fake data for test usage.",
        canonical: `${siteUrl}/en/tools/mock-generator`,
      },
    },

    "icon-browser": {
      zh: {
        title: "图标浏览器 - 在线预览常用图标库",
        description: "搜索并复制常用前端图标，支持多套图标库便捷查找。",
        keywords: "图标库,图标预览,Icon Browser",
        ogTitle: "在线图标浏览器",
        ogDescription: "搜索预览常用图标库。",
        canonical: `${siteUrl}/tools/icon-browser`,
      },
      en: {
        title: "Icon Browser - Search & Preview Icon Libraries",
        description:
          "Search and copy icons across popular UI libraries instantly.",
        keywords: "icon browser,icon preview,frontend icons",
        ogTitle: "Online Icon Browser",
        ogDescription: "Preview and search icons online.",
        canonical: `${siteUrl}/en/tools/icon-browser`,
      },
    },

    "curl-builder": {
      zh: {
        title: "CURL 请求构建工具 - 可视化命令生成",
        description:
          "可视化构建 curl 请求，自动生成命令，一键复制用于 API 测试。",
        keywords: "curl 命令构建,接口调试,API 工具",
        ogTitle: "CURL 请求构建工具",
        ogDescription: "自动生成 CURL 命令。",
        canonical: `${siteUrl}/tools/curl-builder`,
      },
      en: {
        title: "cURL Command Builder - Visual API Request Generator",
        description:
          "Build cURL commands visually for HTTP API testing and automation.",
        keywords: "curl builder,api test,curl generator",
        ogTitle: "Online cURL Builder",
        ogDescription: "Visual command generation for API requests.",
        canonical: `${siteUrl}/en/tools/curl-builder`,
      },
    },

    "qr-generator": {
      zh: {
        title: "二维码生成器 - 在线二维码制作",
        description:
          "输入文本或 URL 即可生成可下载二维码，支持多尺寸和容错率设置。",
        keywords: "二维码生成,在线二维码,二维码制作",
        ogTitle: "在线二维码生成器",
        ogDescription: "输入内容生成二维码。",
        canonical: `${siteUrl}/tools/qr-generator`,
      },
      en: {
        title: "QR Code Generator - Create QR Codes Online",
        description:
          "Generate and download QR codes from text or URLs with custom size options.",
        keywords: "qr generator,create qr code,online qr code",
        ogTitle: "Online QR Code Generator",
        ogDescription: "Create downloadable QR codes instantly.",
        canonical: `${siteUrl}/en/tools/qr-generator`,
      },
    },

    "color-converter": {
      zh: {
        title: "颜色转换工具 - 支持 HEX/RGB/HSL",
        description:
          "在线颜色转换与取色器，支持 HEX、RGB、HSL 相互转换和预览效果。",
        keywords: "颜色转换,在线取色,HEX RGB HSL 转换",
        ogTitle: "颜色取值与转换工具",
        ogDescription: "支持多种颜色格式互转。",
        canonical: `${siteUrl}/tools/color-converter`,
      },
      en: {
        title: "Color Converter & Picker - HEX / RGB / HSL",
        description:
          "Convert colors between HEX, RGB, and HSL formats with preview.",
        keywords: "color converter,color picker,web color tool",
        ogTitle: "Online Color Converter",
        ogDescription: "Convert and preview color formats.",
        canonical: `${siteUrl}/en/tools/color-converter`,
      },
    },

    "password-generator": {
      zh: {
        title: "密码生成器 - 自定义安全随机密码",
        description:
          "在线随机密码生成工具，自定义长度、字符集与强度，安全可靠。",
        keywords: "密码生成器,在线密码,安全随机密码",
        ogTitle: "密码生成器",
        ogDescription: "生成强安全等级密码。",
        canonical: `${siteUrl}/tools/password-generator`,
      },
      en: {
        title: "Password Generator - Create Strong & Secure Passwords",
        description:
          "Generate secure random passwords with custom symbols and strength options.",
        keywords: "password generator,strong password,secure online tool",
        ogTitle: "Online Password Generator",
        ogDescription: "Create secure passwords in one click.",
        canonical: `${siteUrl}/en/tools/password-generator`,
      },
    },

    urlcode: {
      zh: {
        title: "URL 编码解码工具 - 在线 URL Encode/Decode",
        description: "URL 编码与解码工具，处理特殊字符避免网络传输错误。",
        keywords: "URL 编码,URL 解码,Encode Decode",
        ogTitle: "URL 编解码工具",
        ogDescription: "处理 URL 特殊字符。",
        canonical: `${siteUrl}/tools/urlcode`,
      },
      en: {
        title: "URL Encoder / Decoder - Online Tool",
        description:
          "Encode and decode URL strings to fix unsafe characters during transport.",
        keywords: "url encode,url decode,web converter tool",
        ogTitle: "Online URL Encoder & Decoder",
        ogDescription: "Convert URL text safely for web use.",
        canonical: `${siteUrl}/en/tools/urlcode`,
      },
    },

    diff: {
      zh: {
        title: "文本差异对比工具 - 在线 Diff 比对",
        description: "比较两段文本差异，高亮显示不同内容，支持多行与复杂文本。",
        keywords: "文本对比,Diff 工具,在线比对",
        ogTitle: "在线文本对比工具",
        ogDescription: "高亮显示文本差异。",
        canonical: `${siteUrl}/tools/diff`,
      },
      en: {
        title: "Text Compare Tool - Diff Online",
        description:
          "Compare text differences online with highlighted diff results.",
        keywords: "text diff,compare text,diff tool online",
        ogTitle: "Online Text Diff Tool",
        ogDescription: "Quickly compare two text blocks.",
        canonical: `${siteUrl}/en/tools/diff`,
      },
    },
  };
};
