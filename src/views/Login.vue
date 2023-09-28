<template>
  <AuthForm :config="config" />
</template>

<script setup>
import AuthForm from "../components/AuthForm.vue";
const config = {
  type: "login",
  title: "登陆",
  buttonText: "登陆",
  descriptionText: "登陆中"
}
</script>