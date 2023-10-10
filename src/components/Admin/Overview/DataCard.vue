<template>
  <n-card>
    <n-space vertical v-if="!viewStore.shares.length && !viewStore.users.length">
      <n-skeleton text :repeat="1" :sharp="false" width="50%" />
      <n-skeleton text height="30px" :sharp="false" width="90%" />
    </n-space>
    <n-statistic v-else :label="title" tabular-nums>
      <n-text type="info">
        <n-number-animation :from="0" :to="number" />
      </n-text>
      <template #suffix>
        {{ suffix }}
      </template>
    </n-statistic>
  </n-card>
</template>

<script setup>
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
const { title, suffix, number } = defineProps(['title', 'suffix', 'number']);

</script>

<style lang="scss" scoped></style>