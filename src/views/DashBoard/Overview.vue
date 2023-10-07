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
  loadingBar.start();
  await viewStore.getView();
  loadingBar.finish();
});

// import { use } from 'echarts/core'
// import { BarChart } from 'echarts/charts'
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent
// } from 'echarts/components'
// import { CanvasRenderer } from 'echarts/renderers'

// use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])

// const sharesByDayChart = computed(() => {
//   return {
//     title: { text: "分享统计图/天" },
//     tooltip: {},
//     xAxis: {
//       data: viewStore.sharesByDay.map(item => item.day).reverse(),
//     },
//     yAxis: {},
//     series: [
//       {
//         name: "分享数量",
//         type: "bar",
//         data: viewStore.sharesByDay.map(item => item.shares.length).reverse(),
//       },
//     ],
//   }
// });






</script>

<style lang="scss" scoped>

</style>