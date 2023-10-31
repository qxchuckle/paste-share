<template>
  <div class="dash-board-panel">
    <n-layout has-sider>
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="collapsedWidth" :width="siderWidth"
        :collapsed="collapsed" show-trigger="bar" @collapse="collapsed = true" @expand="collapsed = false"
        style="padding-top:5px">
        <n-menu :collapsed="collapsed" :collapsed-width="collapsedWidth" :collapsed-icon-size="collapsedIconSize"
          :options="menuOptions" :default-value="$route.name" />
      </n-layout-sider>
      <n-layout-content class="main">
        <n-scrollbar style="max-height: calc(100vh - 80px)" trigger="none" :x-scrollable="false">
          <router-view :key="$route.fullPath"></router-view>
        </n-scrollbar>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, h, onBeforeUnmount, onBeforeMount, computed } from "vue"
let collapsed = ref(false);
import { NIcon } from "naive-ui";
import { BarChartOutline, List, PeopleOutline } from "@vicons/ionicons5";
import { RouterLink } from "vue-router"
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const siderWidth = ref(200);
const collapsedWidth = ref(60);
const collapsedIconSize = ref(22);

function handleWindowSizeChange() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (screenWidth < 800) {
    collapsed.value = true;
    siderWidth.value = 150;
    if (screenWidth < 500) {
      collapsedWidth.value = 40;
      collapsedIconSize.value = 20;
    } else {
      collapsedWidth.value = 60;
      collapsedIconSize.value = 22;
    }
  } else {
    collapsed.value = false;
    siderWidth.value = 200;
    collapsedWidth.value = 60;
    collapsedIconSize.value = 22;
  }
}

onBeforeMount(() => {
  handleWindowSizeChange();
})

onMounted(() => {
  window.addEventListener("resize", handleWindowSizeChange);
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
})

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = computed(() => ([
  {
    label: () => h(
      RouterLink,
      {
        to: {
          name: "Overview"
        }
      },
      { default: () => t('label.overview') }
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
      { default: () => t('label.shareList') }
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
      { default: () => t('label.userList') }
    ),
    key: "UserList",
    icon: renderIcon(PeopleOutline)
  }
]));

</script>

<style lang="scss" scoped>
.dash-board-panel {
  display: flex;
  margin: 0 auto;
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100vh - 80px);

  .main {
    width: 100%;
    padding: 0px 0px 0px 10px;
    overflow-y: auto;
  }
}
</style>