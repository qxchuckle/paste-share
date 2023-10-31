<template>
  <AuthForm :config="config" />
</template>

<script setup>
import { inject, computed } from "vue";
import AuthForm from "@/components/AuthForm.vue";
import { useRouter } from "vue-router";
const router = useRouter();
import useUserStore from '@/stores/UserStore';
const userStore = useUserStore();
const message = inject('message');
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const config = computed(() => ({
  type: "login",
  title: t('title.login'),
  buttonText: t('btn.login'),
  descriptionText: t('description.loginLoad'),
  apiPath: "/api/login",
  resultHandle: loginResultHandle
}));
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