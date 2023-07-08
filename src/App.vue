<template>
  <n-spin :show="!userStore.isCompleteLogin">
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
      <div class="router-view-box">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <n-divider />
      <div id="footer">
        <div>@轻笑Chuckle</div>
        <!-- <div>快速 · 轻量 · 高效 · 稳定</div> -->
      </div>
    </div>
  </n-spin>
  <n-drawer v-model:show="drawer_active" :width="500" :placement="placement">
    <n-drawer-content title="关于本站">
      <p>本站是快捷方便的文本、代码粘贴分享平台</p>
      <p>1、目的：跨设备、远程进行文本、代码的传输与展示（起初只是为了在qq群里发代码不刷屏）</p>
      <p>2、分享的内容会在7天后自动销毁，请勿用于保存重要信息</p>
      <p>3、密码请自行记住，存入数据库中的密码经过了md5加密，除非密码简单，否则除了你没有其他人能知道密码</p>
      <p>4、语言可以选择纯文本或多种语言的代码高亮</p>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref } from "vue"
// 导入路由器和路由
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
const drawer_active = ref(false);
const placement = ref("bottom");
const activate = (place) => {
  drawer_active.value = true;
  placement.value = place;
};
import useUserStore from './stores/UserStore'
const userStore = useUserStore();

const logout = () => {
  userStore.token = "";
  userStore.username = "";
  userStore.isLogin = false;
  localStorage.removeItem("token");
  localStorage.removeItem("username");
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


</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  min-height: 100vh;

  .router-view-box {
    width: 100%;
    flex: 1;
  }

  #nav {
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
    border-bottom: 1px solid rgb(239, 239, 245);
    padding: 10px;
    margin-bottom: 20px;
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
        color: #363636;
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
  }
}
</style>
