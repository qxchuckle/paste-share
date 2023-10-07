<template>
  <n-card>
    <n-statistic :label="title" tabular-nums>
      <n-number-animation :from="0" :to="number" />
      <template #suffix>
        {{ suffix }}
      </template>
    </n-statistic>
  </n-card>
</template>

<script setup>
const { title,suffix,number } = defineProps(['title', 'suffix', 'number']);

</script>

<style lang="scss" scoped></style>