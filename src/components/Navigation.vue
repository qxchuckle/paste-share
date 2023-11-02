<template>
  <div class="btn-box">
    <n-button class="btn" quaternary strong circle size="small" type="info" @click="back" :disabled="backAble">
      <n-icon>
        <ChevronBackOutline />
      </n-icon>
    </n-button>
    <n-button class="btn" quaternary strong circle size="small" type="info" @click="forward" :disabled="forwardAble">
      <n-icon>
        <ChevronForwardOutline />
      </n-icon>
    </n-button>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'
import { useRouter } from "vue-router"
const router = useRouter();

const backAble = ref(true);
const forwardAble = ref(true);

watch(() => router.currentRoute.value.fullPath, (newValue, oldValue) => {
  backAble.value = !router.options.history.state.back;
  forwardAble.value = !router.options.history.state.forward;
}, { immediate: true });

function back() {
  if (router.options.history.state.back) {
    router.go(-1);
  }
}

function forward() {
  if (router.options.history.state.forward) {
    router.go(1);
  }
}

</script>

<style lang="scss" scoped>
.btn-box {
  display: flex;
  flex-flow: wrap;
  align-content: center;
  align-items: center;

  .btn {
    font-size: 22px;
  }
}
</style>