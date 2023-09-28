<template>
  <AuthForm :config="config" />
</template>

<script setup>
import { inject } from "vue";
import AuthForm from "../components/AuthForm.vue";
import { useRouter } from "vue-router";
const router = useRouter();
import useUserStore from '../stores/UserStore';
const userStore = useUserStore();
const message = inject('message');
const config = {
  type: "login",
  title: "登陆",
  buttonText: "登陆",
  descriptionText: "登陆中",
  apiPath: "/api/login",
  resultHandle: loginResultHandle
}
function loginResultHandle(result, user) {
  message.success(result.msg);
  userStore.$patch(state => {
    state.username = result.data.username;
    state.token = result.data.token;
    state.userType = result.data.userType;
    state.isLogin = true;
  });
  // 记住我
  if (user.remember) {
    localStorage.setItem("username", user.username);
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("remember", 1);
  } else {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("remember");
  }
  router.push({
    name: 'Home',
  })
}


</script>