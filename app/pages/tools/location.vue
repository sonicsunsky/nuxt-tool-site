<template>
  <UContainer class="py-8 max-w-6xl">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        经纬度/位置定位转换工具
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        基于高德地图：支持坐标拾取、地址解析、当前定位查询
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UCard class="lg:col-span-1 h-fit">
        <template #header>
          <div class="font-semibold">操作面板</div>
        </template>

        <div class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              位置/地址名称
            </label>
            <div class="flex gap-2">
              <UInput
                v-model="addressForm.address"
                placeholder="例如：北京市朝阳公园"
                class="flex-1"
                :ui="{ icon: { trailing: { pointer: '' } } }"
                @keyup.enter="geoCode"
              >
                <template #trailing>
                  <UButton
                    v-if="addressForm.address"
                    color="neutral"
                    variant="link"
                    icon="i-heroicons-x-mark"
                    @click="addressForm.address = ''"
                  />
                </template>
              </UInput>

              <UButton icon="i-heroicons-magnifying-glass" @click="geoCode" />
            </div>
          </div>

          <hr class="border-gray-200 dark:border-gray-700" />

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">
              经纬度坐标
            </label>
            <div class="flex gap-2 items-center">
              <UInput
                v-model="addressForm.lng"
                placeholder="经度"
                class="w-1/2"
              />
              <span class="text-gray-400">,</span>
              <UInput
                v-model="addressForm.lat"
                placeholder="纬度"
                class="w-1/2"
              />
            </div>
            <UButton
              block
              label="定位坐标"
              color="primary"
              variant="solid"
              class="mt-2"
              @click="regeoCode"
            />
          </div>

          <hr class="border-gray-200 dark:border-gray-700" />

          <div class="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-gray-500 uppercase"
                >当前解析结果</span
              >
              <UButton
                size="xs"
                icon="i-heroicons-map-pin"
                label="获取我的位置"
                :loading="locating"
                @click="getCurrentLocation"
              />
            </div>

            <div>
              <div class="text-xs text-gray-500">标准化地址</div>
              <div class="text-sm font-medium break-words">
                {{ resultInfo.formattedAddress || "-" }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <div class="text-xs text-gray-500">经度</div>
                <div class="font-mono text-sm font-bold text-primary-600">
                  {{ resultInfo.lng || "-" }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-500">纬度</div>
                <div class="font-mono text-sm font-bold text-primary-600">
                  {{ resultInfo.lat || "-" }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="errorMsg"
            class="text-red-500 text-sm flex items-center gap-1"
          >
            <UIcon name="i-heroicons-exclamation-circle" /> {{ errorMsg }}
          </div>
        </div>
      </UCard>

      <ClientOnly>
        <div
          class="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative min-h-[500px]"
        >
          <div id="container" class="w-full h-full absolute inset-0 z-0"></div>

          <div
            v-if="!mapLoaded"
            class="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80"
          >
            <div class="text-center">
              <UIcon
                name="i-heroicons-arrow-path"
                class="animate-spin w-10 h-10 text-primary-500 mb-2"
              />
              <p class="text-sm text-gray-500">正在加载高德地图...</p>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
// 【关键修改 1】: 删除了顶部的 import AMapLoader from ...
// 避免服务端加载该模块导致 window is not defined

useHead({
  title: "经纬度查询工具",
});

// ================= 配置 =================
const AMAP_KEY = "574747b9fc611b541f611f5391183d5c";
const AMAP_SECURITY_CODE = "f75212dec136b407c9af0bc20fdeffbe";
// =======================================

// 响应式状态
const mapLoaded = ref(false);
const locating = ref(false);
const errorMsg = ref("");
const addressForm = reactive({ address: "", lng: "", lat: "" });
const resultInfo = reactive({ formattedAddress: "", lng: "", lat: "" });

// 地图实例引用
const map = shallowRef<any>(null);
const marker = shallowRef<any>(null);
const geocoder = shallowRef<any>(null);
const AMapObj = shallowRef<any>(null);

// 初始化地图逻辑
const initMap = async () => {
  // 确保只在客户端执行
  if (import.meta.client) {
    try {
      // 设置安全密钥
      (window as any)._AMapSecurityConfig = {
        securityJsCode: AMAP_SECURITY_CODE,
      };

      // 【关键修改 2】: 使用动态 import
      // 这样该包只会在浏览器端被下载和执行
      const AMapLoaderModule = await import("@amap/amap-jsapi-loader");
      // 处理可能得 default 导出 (视构建工具而定，通常直接用 module.load 或 module.default.load)
      const load =
        AMapLoaderModule.load || (AMapLoaderModule as any).default?.load;

      const AMap = await load({
        key: AMAP_KEY,
        version: "2.0",
        plugins: [
          "AMap.Geocoder",
          "AMap.Geolocation",
          "AMap.ToolBar",
          "AMap.Scale",
        ],
      });

      AMapObj.value = AMap;
      map.value = new AMap.Map("container", {
        zoom: 11,
        center: [116.397428, 39.90923],
        viewMode: "2D",
      });

      map.value.addControl(new AMap.ToolBar());
      map.value.addControl(new AMap.Scale());

      geocoder.value = new AMap.Geocoder({ city: "全国" });

      map.value.on("click", (e: any) => {
        const { lng, lat } = e.lnglat;
        updateMarker(lng, lat);
        getAddress([lng, lat]);
      });

      mapLoaded.value = true;
      getCurrentLocation();
    } catch (e: any) {
      console.error("地图初始化失败:", e);
      errorMsg.value = "地图加载失败，请检查网络或密钥";
    }
  }
};

// --- 以下功能函数保持不变 ---

const geoCode = () => {
  if (!addressForm.address || !geocoder.value) return;
  errorMsg.value = "";
  geocoder.value.getLocation(
    addressForm.address,
    (status: string, result: any) => {
      if (status === "complete" && result.geocodes.length) {
        const { lng, lat } = result.geocodes[0].location;
        updateMarker(lng, lat);
        map.value.setFitView([marker.value]);
        updateResultUI(result.geocodes[0].formattedAddress, lng, lat);
      } else {
        errorMsg.value = "地址未找到";
      }
    }
  );
};

const regeoCode = () => {
  const lng = parseFloat(addressForm.lng);
  const lat = parseFloat(addressForm.lat);
  if (!lng || !lat || !geocoder.value) return;

  updateMarker(lng, lat);
  map.value.setCenter([lng, lat]);
  getAddress([lng, lat]);
};

const getAddress = (lnglat: any[]) => {
  if (!geocoder.value) return;
  geocoder.value.getAddress(lnglat, (status: string, result: any) => {
    if (status === "complete" && result.regeocode) {
      updateResultUI(result.regeocode.formattedAddress, lnglat[0], lnglat[1]);
    }
  });
};

// 功能 3: 获取浏览器当前定位
const getCurrentLocation = () => {
  if (!map.value || !AMapObj.value) return;
  locating.value = true;
  errorMsg.value = "";

  const geolocation = new AMapObj.value.Geolocation({
    enableHighAccuracy: true, // 是否使用高精度定位
    timeout: 10000, // 超过10秒后停止定位
    zoomToAccuracy: true, // 定位成功后调整地图视野
    buttonPosition: "RB",
    // 【关键修改 1】必须设置为 true，才会返回 formattedAddress
    needAddress: true,
  });

  geolocation.getCurrentPosition((status: string, result: any) => {
    console.log("定位状态:", status, result); // 调试用
    locating.value = false;

    if (status === "complete") {
      // 获取坐标：高德 v2 有时返回 result.position 是对象，有时是数组，做个兼容处理
      let lng, lat;
      if (Array.isArray(result.position)) {
        [lng, lat] = result.position;
      } else {
        lng = result.position.lng;
        lat = result.position.lat;
      }

      updateMarker(lng, lat);

      // 【关键修改 2】双重保障逻辑
      // 如果配置了 needAddress: true 还是没有返回地址（偶尔会发生），
      // 或者返回的地址是空的，我们手动调用一次 geocoder 来获取地址
      if (result.formattedAddress && result.formattedAddress !== "") {
        // 情况 A: 自动获取地址成功
        updateResultUI(result.formattedAddress, lng, lat);
      } else {
        // 情况 B: 定位成功但没地址，手动查一次
        console.warn("定位成功但未返回地址，尝试手动逆地理编码...");
        getAddress([lng, lat]);
      }
    } else {
      // 定位失败
      errorMsg.value =
        "定位失败，请确保浏览器允许获取位置信息，且网站使用 HTTPS 协议";
    }
  });
};

const updateMarker = (lng: number, lat: number) => {
  if (!map.value) return;
  if (marker.value) {
    marker.value.setPosition([lng, lat]);
  } else {
    marker.value = new AMapObj.value.Marker({ position: [lng, lat] });
    map.value.add(marker.value);
  }
};

const updateResultUI = (address: string, lng: any, lat: any) => {
  resultInfo.formattedAddress = address;
  resultInfo.lng = lng;
  resultInfo.lat = lat;

  addressForm.address = address;
  addressForm.lng = lng;
  addressForm.lat = lat;
};

// 生命周期
onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map.value) map.value.destroy();
});
</script>

<style scoped>
#container {
  min-height: 500px;
}
</style>
