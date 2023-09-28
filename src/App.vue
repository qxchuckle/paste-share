<template>
  <n-config-provider :theme="theme">
    <n-layout>
      <n-spin :show="!userStore.isCompleteLogin">
        <n-layout-content>
          <div class="main">
            <div id="nav">
              <n-space class="title-box">
                <n-gradient-text class="title" type="info" @click="toHome()">粘贴分享</n-gradient-text>
              </n-space>
              <div class="login-reg" v-if="!userStore.isLogin">
                <n-button class="btn" @click="toLogin()">登陆</n-button>
                <n-button class="btn" @click="toReg()">注册</n-button>
              </div>
              <n-space v-if="userStore.isLogin">
                <Menu></Menu>
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
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref } from "vue";
import RightSide from "./components/RightSide.vue";
import Menu from "./components/Menu.vue";
// 导入路由器和路由
import { useRouter } from "vue-router";
const router = useRouter();
import useUserStore from './stores/UserStore';
const userStore = useUserStore();

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
