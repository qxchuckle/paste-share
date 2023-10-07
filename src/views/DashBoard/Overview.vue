<template>
  <div style="padding: 5px 10px">
    <OverviewCards></OverviewCards>
    <OverviewCharts></OverviewCharts>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue"
import useViewStore from '../../stores/ViewStore'
const viewStore = useViewStore();
import { useLoadingBar } from 'naive-ui'
const loadingBar = useLoadingBar();
import OverviewCards from '@/components/Admin/Overview/OverviewCards.vue';
import OverviewCharts from '@/components/Admin/Overview/OverviewCharts.vue';

onBeforeMount(async () => {
  await getData();
});

const getData = async () => {
  loadingBar.start();
  await viewStore.getView();
  loadingBar.finish();
}

</script>

<style lang="scss" scoped></style>