<template>
  <n-config-provider :theme="theme" :locale="zhCN">
    <n-layout>
      <n-loading-bar-provider>
        <n-spin :show="!userStore.isCompleteLogin">
          <n-layout>
            <div class="main">
              <n-layout-header bordered style="height: 50px;">
                <div id="nav">
                  <n-space class="title-box">
                    <n-gradient-text class="title" type="info" @click="toHome()">粘贴分享</n-gradient-text>
                    <Breadcrumb></Breadcrumb>
                  </n-space>
                  <div class="login-reg" v-if="!userStore.isLogin">
                    <n-button class="btn" @click="toLogin()">登陆</n-button>
                    <n-button class="btn" @click="toReg()">注册</n-button>
                  </div>
                  <n-space v-if="userStore.isLogin">
                    <Menu></Menu>
                  </n-space>
                </div>
              </n-layout-header>
              <n-scrollbar style="height: calc(100vh - 80px);" trigger="none">
                <div class="router-view-box">
                  <n-space vertical class="router-load" v-if="!userStore.isCompleteLogin">
                    <n-alert title="提示" type="info" style="margin: 0 0 10px;">
                      自动登录中，请稍等
                    </n-alert>
                    <n-skeleton text height="30px" :sharp="false" width="33%" />
                    <n-skeleton text height="35px" :sharp="false" width="60%" />
                    <n-skeleton text :repeat="3" :sharp="false" />
                    <n-skeleton text :repeat="1" :sharp="false" width="80%" />
                  </n-space>
                  <router-view v-else :key="$route.fullPath"></router-view>
                </div>
              </n-scrollbar>
              <n-layout-footer bordered id="footer">
                <div style="margin-right: 8px;">@轻笑Chuckle</div>
                <div>项目: <a href="https://github.com/qxchuckle/paste-share" target='_blank'>qxchuckle/paste-share</a>
                </div>
              </n-layout-footer>
            </div>
          </n-layout>
          <template #description>
            加载中
          </template>
        </n-spin>
        <RightSide @emit="rightSideEmit"></RightSide>
      </n-loading-bar-provider>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref } from "vue";
import RightSide from "@/components/RightSide.vue";
import Menu from "@/components/Menu.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
// 导入路由器和路由
import { useRouter } from "vue-router"
const router = useRouter()
import useUserStore from '@/stores/UserStore';
const userStore = useUserStore();
import { zhCN } from 'naive-ui'

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

!(function (t) {
  function e() {
    var e = this || self;
    (e.globalThis = e), delete t.prototype._T_;
  }
  "object" != typeof globalThis &&
    (this
      ? e()
      : (t.defineProperty(t.prototype, "_T_", {
        configurable: !0,
        get: e,
      }),
        _T_));
})(Object);

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
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;

    .router-load {
      width: 100%;
      max-width: 600px;
      padding: 0 10px;
      margin-top: 20px;
    }
  }

  #nav {
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
    padding: 10px 10px 5px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;

    .title-box {
      align-items: center;
    }

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
    transition: all 0.2s;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    height: 30px;
    align-items: center;
    min-width: max-content;

    a {
      color: rgb(150, 150, 150);

      &:hover {
        color: rgb(40, 149, 213);
      }
    }
  }
}
</style>
