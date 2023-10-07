<template>
  <DataChart :option="option"></DataChart>
</template>

<script setup>
import { computed } from "vue"
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    title: {
      left: 'center',
      text: '语言类型统计'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: viewStore.sharesByLanguage.map(item => item.language === "text" ? "纯文本" : item.language),
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: viewStore.sharesByLanguage.map(item => item.shares.length)
      }
    ]
  }
})

</script>

<style lang="scss" scoped></style>