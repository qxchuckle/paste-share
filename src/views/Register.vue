<template>
  <AuthForm :config="config" />
</template>

<script setup>
import { inject } from "vue";
import AuthForm from "../components/AuthForm.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const message = inject('message');
const config = {
  type: "reg",
  title: "注册",
  buttonText: "注册",
  descriptionText: "注册中",
  apiPath: "/api/reg",
  resultHandle: regResultHandle
}
function regResultHandle(result, user) {
  message.success(result.msg);
  router.push({
    name: 'Login',
  })
}
</script>