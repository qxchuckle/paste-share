<template>
  <n-dropdown trigger="click" :options="options" :show-arrow="true" @select="handleSelect">
    <n-badge value="菜单" class="badge">
      <n-avatar>{{ userStore.username }}</n-avatar>
    </n-badge>
  </n-dropdown>
  <n-drawer v-model:show="drawer_active" :default-height="230" :placement="placement">
    <n-drawer-content title="关于本站">
      <n-space vertical>
        <span>本站是快捷方便的文本、代码粘贴分享平台</span>
        <span>1、目的：跨设备、远程进行文本、代码的传输与展示</span>
        <span>2、不保证数据的安全稳定，请勿用于保存重要信息</span>
        <span>3、分享密码经过加密传输与保存，请自行妥善保存</span>
        <span>4、语言可以选择纯文本或多种代码高亮</span>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { h, computed, onMounted, inject } from "vue";
import { NAvatar, NIcon, NText } from "naive-ui";
const message = inject('message');
import useUserStore from '@/stores/UserStore';
const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
import { ReaderOutline, HomeOutline, NavigateOutline, LogOutOutline, SettingsOutline } from '@vicons/ionicons5';

const userType = computed(() => {
  let type = "游客";
  switch (userStore.userType) {
    case 'user':
      type = "普通用户";
      break;
    case 'admin':
      type = "普通管理员";
      break;
    case 'super':
      type = "超级管理员";
      break;
  }
  return type;
});

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function renderCustomHeader() {
  return h(
    "div",
    {
      style: "display: flex; align-items: center; padding: 8px 12px;"
    },
    [
      h(NAvatar, {
        round: true,
        style: "margin-right: 12px;",
        src: "data:image/webp;base64,UklGRu4DAABXRUJQVlA4IOIDAACQIgCdASrhAOEAPjEYi0OiIaES75w8IAMEtLd+Pkx6MLwAjcybYkSndYoDsrlwhAxE3NLBPV9hW+wrfYVvlM5NinsCWA1XANE7ICdiGDbZDdu9I7W80GU2BwJ2QE6R9qOggTpHBZqFAOixurRo8EALvuu9MhZ4T6s+m256dTRBpa/cnSXhv/v+gh+KSAl8J7BaQxDGCPX7HzWEvzhdosbqvY6OCxOSwNdZtdq/2p0NFjd6pJeW9xxUVMgDR9ggf8l4m9ChHEeem5kfJJt//i6AAmC+8TUuM/Z3FCRlV9aNx7FxFUOvV+JDCpopspYOHczqzVEWN4RLkJprwhGFqG16mMgWzUMOPZmoYCirzNG77RY3esbvWN3rG71jdUAA/v+ssCbjh70Ii+svBCjvSXtjbW7bvZehp1J7A4ZbaE0y2e5MBuy/WpyEK/szn6bsZ9OwaMIyPQMi+NGpfe17ZZCh2uttw5pMI51jbzkfoysxQpkIlr5pUuulyOOq6tlHxs4/G4Dnql4Og4vnkAkdnqvJfPkwBH1GHL3QjgVtTLzdQ/yVDdzhrhMNdCBBnewupx2v9KCOs1PH3Dxq0W4P07A1pF1RRB+psQvHnn9iPtHyVcSMsK6A+HoYg+ysAdulbH2JNirOl0nXs2Ob64Dk8XwJyqmAjIMFj8ISolTXZitQqBzEx2gZjsRMW1aTB47/VE3bVLoy+ss8E6IbtCI3d7aIrElV3M8/6Ie7F2qa5VF2jp9HqFGALuyxnUYH52PjWimUd/pKF+LurEJflnut+Blf84CJwjM0U8n6H12/7fe0a+5eFI5xj0E7cQS9lN0f6a2RdjufZIvEvKFs5Kophds9xoLmoIC6MgOrZwih3f9xfmb1BmFLoFvGoREPXxuWnUe1GE7x674nCD95zlq7iSOmiuywCZ1kbPxZcUSJfURlHBQ2/NgafnNUNd9ngk3KaminxGCctE9JUP6c5BXN+XIr3fAzIzp+lPcLQ3sZT7j3Yu1M0tQH2ncvIaqvmw3+hb3jl5q3SKJ6VLLldXTXaNTAydoLfhOou0wZqup0fclUd+WS1oM/ecTsFo5kYzkXy1Dxbgf8WKV8eOtBY7eQZ9bXAOwKxq5D+a8lWic5t1tJqw5WdSzlY98Ub1PvPilt6PQvLtECVj7xu83931VgOel1F0nZlH5hgJmCW6oO6WqQcn5LH63fbE4zQidOG6qjKiB0lXyokwatJq8exdn3aONynSBWVlvcv7AdUbs2LNIUnWfbhmgvPgARl3Vi4KN+4tRS0FhjWUTRisQ65zQ1XbpXuvnq49dzDEV2IZZdlEtgAAAA"
      }),
      h("div", null, [
        h("div", null, [h(NText, { depth: 2 }, { default: () => userStore.username })]),
        h("div", { style: "font-size: 12px;" }, [
          h(
            NText,
            { depth: 3 },
            { default: () => userType.value }
          )
        ])
      ])
    ]
  );
}
const options = ref([
  {
    key: "header",
    type: "render",
    render: renderCustomHeader
  },
  {
    key: "header-divider",
    type: "divider"
  },
  {
    label: "主页",
    icon: renderIcon(HomeOutline),
    key: "home"
  },
  {
    label: "我的分享",
    icon: renderIcon(ReaderOutline),
    key: "list"
  },
  {
    label: "关于本站",
    icon: renderIcon(NavigateOutline),
    key: "about"
  },
  {
    label: "登出",
    icon: renderIcon(LogOutOutline),
    key: "logout"
  }
])

onMounted(() => {
  if (userStore.userType === 'admin' || userStore.userType === 'super') {
    const e = {
      label: "管理后台",
      icon: renderIcon(SettingsOutline),
      key: "admin"
    }
    options.value.splice(-1, 0, e);
  }
})


function handleSelect(key) {
  switch (key) {
    case 'home':
      toHome();
      break;
    case 'list':
      toList();
      break;
    case 'about':
      activate('bottom');
      break;
    case 'admin':
      toAdmin();
      break;
    case 'logout':
      logout();
      break;
  }
}

const toHome = () => {
  router.push({
    name: 'Home',
  })
}

const toList = () => {
  router.push({
    name: 'List',
  })
}

const toAdmin = () => {
  router.push({
    name: 'Admin',
  })
}

const drawer_active = ref(false);
const placement = ref("bottom");
const activate = (place) => {
  drawer_active.value = true;
  placement.value = place;
};

const logout = () => {
  userStore.logout();
  toHome();
  message.success("已登出");
}

</script>

<style lang="scss" scoped>
.badge {
  cursor: pointer;
}

@media screen and (max-width:800px) {
  .badge {
    margin-right: 8px;
  }
}
</style>