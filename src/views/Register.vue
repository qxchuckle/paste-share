<template>
  <AuthForm :config="config" />
</template>

<script setup>
import { inject, computed } from "vue";
import AuthForm from "@/components/AuthForm.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const message = inject('message');
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const config = computed(() => ({
  type: "reg",
  title: t('title.register'),
  buttonText: t('btn.register'),
  descriptionText: t('description.registerLoad'),
  apiPath: "/api/reg",
  resultHandle: regResultHandle
}));
function regResultHandle(result, user) {
  message.success(result.msg);
  router.push({
    name: 'Login',
  })
}
</script>