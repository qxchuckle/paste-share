<template>
  <AuthForm :config="config" />
</template>

<script setup>
import AuthForm from "../components/AuthForm.vue";
const config = {
  type: "reg",
  title: "注册",
  buttonText: "注册",
  descriptionText: "注册中"
}
</script>