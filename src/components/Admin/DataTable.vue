<template>
  <n-data-table :columns="columns" :single-line="false" :data="data" :pagination="pagination" size="small"
    :max-height="maxHeight" :scroll-x="1000"/>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue"
const { pagination, columns, data } = defineProps(['pagination', 'columns', 'data']);

const maxHeight = ref(500);

function changeTableSize() {
  nextTick(() => {
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    maxHeight.value = screenHeight - 168;
  });
}

onMounted(() => {
  changeTableSize();
  window.addEventListener("resize", changeTableSize);
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", changeTableSize);
})

</script>

<style lang="scss" scoped></style>