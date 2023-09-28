<template>
  <div class="not-found">
    <n-result status="info" title="404" description="总有找不到的时候">
      <template #footer>
        <n-button @click="toHome">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
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
}
</style>