<template>
  <div style="padding: 10px 10px 0">
    <OverviewCards class="overview-cards"></OverviewCards>
    <OverviewCharts></OverviewCharts>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue"
import useViewStore from '@/stores/ViewStore'
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

<style lang="scss" scoped>
@media screen and (min-width:500px) {
  .overview-cards {
    margin-right: 6px;
  }
}
</style>