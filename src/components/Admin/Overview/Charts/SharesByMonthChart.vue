<template>
  <DataChart :option="option"></DataChart>
</template>

<script setup>
import { computed } from "vue"
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import DataChart from "@/components/Admin/Overview/DataChart.vue";
import { use } from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    title: {
      left: 'center',
      text: '分享统计图/月'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: viewStore.sharesByMonth.map(item => item.month).reverse()
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    series: [
      {
        name: '分享数',
        data: viewStore.sharesByMonth.map(item => item.shares.length).reverse(),
        type: 'line',
        areaStyle: {}
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>