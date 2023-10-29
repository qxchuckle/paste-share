<template>
  <div>
    <n-breadcrumb>
      <n-breadcrumb-item separator=">" v-for="item in routers" @click="toRoute(item)"
        :clickable="item.meta.breadcrumb.click">
        <n-tag :bordered="false" type="info" v-if="item.meta.breadcrumb.type === 'tag'">
          {{ item.meta.title }}
        </n-tag>
        {{ item.meta.breadcrumb.type === 'text' ? item.meta.title : '' }}
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()

const routers = computed(() => {
  return router.currentRoute.value.matched;
});

const toRoute = (route) => {
  if (route.meta.breadcrumb.click) {
    router.push({
      name: route.name
    })
  }
}

</script>

<style lang="scss"></style>