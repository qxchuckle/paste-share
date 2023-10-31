<template>
  <div class="not-found">
    <n-result status="info" title="404" :description="t('description.NotFount')">
      <template #footer>
        <n-button @click="toHome">{{ t('btn.backHome') }}</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
function toHome() {
  router.push({
    name: "Home",
  })
}
</script>

<style lang="scss" scoped>
.not-found {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  padding: 20px 0;
}
</style>