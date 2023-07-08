<template>
  <div id="nav">
    <div class="title">粘贴分享
      <n-button @click="activate('bottom')" style="margin-left: 10px;">
        关于本站
      </n-button>
    </div>
    <div class="login-reg" v-if="!userStore.isLogin">
      <n-button class="btn">登陆</n-button>
      <n-button class="btn">注册</n-button>
    </div>
    <n-space class="user" v-if="userStore.isLogin">
      <div class="username">{{ userStore.username }}</div>
      <n-button class="btn" @click="logout()">登出</n-button>
    </n-space>
  </div>
  <router-view :key="$route.fullPath"></router-view>
  <n-drawer v-model:show="drawer_active" :width="500" :placement="placement">
    <n-drawer-content title="关于本站">
      本站是快捷方便的文本、代码粘贴分享平台
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue"
import { storeToRefs } from 'pinia'
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

</script>

<style lang="scss" scoped>
#nav {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;
  border-bottom: 1px solid rgb(239, 239, 245);
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 20px;
    color: #363636;
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
</style>
