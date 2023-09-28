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
        <span>2、分享内容会在7天后自动销毁，请勿用于保存重要信息</span>
        <span>3、分享密码经过加密传输与保存，请自行妥善保存</span>
        <span>4、语言可以选择纯文本或多种语言的代码高亮</span>
      </n-space>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { h, computed } from "vue";
import { NAvatar, NIcon, NText } from "naive-ui";
const message = inject('message');
import useUserStore from '../stores/UserStore';
const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
import { ReaderOutline, HomeOutline, NavigateOutline, LogOutOutline } from '@vicons/ionicons5';

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
        src: "https://www.qcqx.cn/head.webp"
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
const options = [
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
    label: "管理",
    icon: renderIcon(ReaderOutline),
    key: "admin"
  },
  {
    label: "关于",
    icon: renderIcon(NavigateOutline),
    key: "about"
  },
  {
    label: "登出",
    icon: renderIcon(LogOutOutline),
    key: "logout"
  }
]

function handleSelect(key) {
  switch (key) {
    case 'home':
      toHome();
      break;
    case 'admin':
      toAdmin();
      break;
    case 'about':
      activate('bottom');
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