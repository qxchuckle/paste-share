<template>
  <div class="dash-board-panel">
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="60" :width="200" :collapsed="collapsed"
        show-trigger="bar" @collapse="collapsed = true" @expand="collapsed = false" style="padding-top:5px">
        <n-menu :collapsed="collapsed" :collapsed-width="60" :collapsed-icon-size="22" :options="menuOptions"
          :default-value="route.name" />
      </n-layout-sider>
      <n-layout-content class="main">
        <router-view :key="$route.fullPath"></router-view>
        <n-back-top :right="60" />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h, onBeforeUnmount } from "vue"
let collapsed = ref(false);
import useUserStore from '../../stores/UserStore'
const userStore = useUserStore();
import { NIcon } from "naive-ui";
import { BookOutline, HomeOutline, BookmarksOutline, ExitOutline } from "@vicons/ionicons5";
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
    icon: renderIcon(BookOutline)
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
    icon: renderIcon(BookOutline)
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
    icon: renderIcon(BookOutline)
  }
];

</script>

<style lang="scss" scoped>
.dash-board-panel {
  display: flex;
  margin: 0 auto;
  position: relative;
  height: 100%;
  flex: 1;
  width: 100%;

  .main {
    width: 100%;
    padding: 10px 15px;
    overflow-y: auto;
  }
}
</style>