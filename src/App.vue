<template>
  <n-config-provider :theme="theme">
    <n-layout>
      <n-spin :show="!userStore.isCompleteLogin">
        <n-layout-content>
          <div class="main">
            <div id="nav">
              <n-space class="title-box">
                <n-gradient-text class="title" type="info" @click="toHome()">粘贴分享</n-gradient-text>
                <n-button @click="activate('bottom')">
                  关于
                </n-button>
              </n-space>
              <div class="login-reg" v-if="!userStore.isLogin">
                <n-button class="btn" @click="toLogin()">登陆</n-button>
                <n-button class="btn" @click="toReg()">注册</n-button>
              </div>
              <n-space class="user" v-if="userStore.isLogin">
                <div class="username">{{ userStore.username }}</div>
                <n-button class="btn" @click="toAdmin()">管理</n-button>
                <n-button class="btn" @click="logout()">登出</n-button>
              </n-space>
            </div>
            <n-divider style="margin: 0 0 15px 0;max-width: 810px;"></n-divider>
            <div class="router-view-box">
              <router-view :key="$route.fullPath"></router-view>
            </div>
            <n-divider />
            <div id="footer">
              <div>@轻笑Chuckle</div>
              <div>项目：<a href="https://github.com/qxchuckle/paste-share" target='_blank'>qxchuckle/paste-share</a></div>
            </div>
          </div>
        </n-layout-content>
        <template #description>
          加载中
        </template>
      </n-spin>
      <RightSide @emit="rightSideEmit"></RightSide>
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
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref } from "vue";
import RightSide from "./components/RightSide.vue";
// 导入路由器和路由
import { useRouter, useRoute } from "vue-router";
const message = inject('message');
const router = useRouter();
const route = useRoute();
const drawer_active = ref(false);
const placement = ref("bottom");
const activate = (place) => {
  drawer_active.value = true;
  placement.value = place;
};
import useUserStore from './stores/UserStore';
const userStore = useUserStore();

const logout = () => {
  userStore.token = "";
  userStore.username = "";
  userStore.userType = "";
  userStore.isLogin = false;
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  message.success("已登出");
}

const toHome = () => {
  router.push({
    name: 'Home',
  })
}

const toLogin = () => {
  router.push({
    name: 'Login',
  })
}

const toReg = () => {
  router.push({
    name: 'Register',
  })
}

const toAdmin = () => {
  router.push({
    name: 'Admin',
  })
}

const theme = ref(null);
function rightSideEmit(value) {
  theme.value = value;
}

</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  min-height: 100vh;
  color: var(--n-text-color);
  align-items: center;

  .router-view-box {
    width: 100%;
    flex: 1;
  }

  #nav {
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;

    .title {
      font-size: 22px;
      cursor: pointer;
    }

    .login-reg {
      .btn {
        margin-left: 10px;
      }
    }

    .user {
      .username {
        font-size: 16px;
        line-height: 33px;
      }
    }
  }

  #footer {
    text-align: center;
    width: 100%;
    color: rgb(150, 150, 150);
    font-size: 14px;
    line-height: 20px;
    padding-bottom: 5px;
    transition: all 0.2s;

    a {
      color: rgb(150, 150, 150);

      &:hover {
        color: rgb(40, 149, 213);
      }
    }
  }
}
</style>
