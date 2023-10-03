<template>
  <div class="dash-board-panel">
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="60" :width="200" :collapsed="collapsed"
        show-trigger="bar" @collapse="collapsed = true" @expand="collapsed = false" style="padding-top:5px">
        <n-menu :collapsed="collapsed" :collapsed-width="60" :collapsed-icon-size="22" :options="menuOptions"
          :default-value="route.name" />
      </n-layout-sider>
      <n-layout-content class="main">
        <n-scrollbar style="max-height: calc(100vh - 100px)" trigger="none">
          <router-view :key="$route.fullPath"></router-view>
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, h, onBeforeUnmount } from "vue"
let collapsed = ref(false);
import { NIcon } from "naive-ui";
import { BarChartOutline, List, PeopleOutline } from "@vicons/ionicons5";
import { useRouter, useRoute, RouterLink } from "vue-router"
const router = useRouter()
const route = useRoute()

function handleWindowSizeChange() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (screenWidth < 800) {
    collapsed.value = true;
  } else {
    collapsed.value = false;
  }
}

onMounted(() => {
  handleWindowSizeChange();
  window.addEventListener("resize", handleWindowSizeChange);
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
})

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Overview"
        }
      },
      { default: () => "数据概览" }
    ),
    key: "Overview",
    icon: renderIcon(BarChartOutline)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "ShareList"
        }
      },
      { default: () => "分享列表" }
    ),
    key: "ShareList",
    icon: renderIcon(List)
  },
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "UserList"
        }
      },
      { default: () => "用户列表" }
    ),
    key: "UserList",
    icon: renderIcon(PeopleOutline)
  }
];

</script>

<style lang="scss" scoped>
.dash-board-panel {
  display: flex;
  margin: 0 auto;
  position: relative;
  flex: 1;
  width: 100%;

  .main {
    width: 100%;
    padding: 5px 10px;
    overflow-y: auto;
  }
}
</style>