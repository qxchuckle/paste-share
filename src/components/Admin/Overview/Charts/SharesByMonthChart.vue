<template>
  <DataChart :option="option"></DataChart>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import DataChart from "@/components/Admin/Overview/DataChart.vue";
import { use } from 'echarts/core';
import {
  GridComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, MarkLineComponent, MarkPointComponent]);

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
    },
    title: {
      left: 'center',
      text: t('title.monthlySharedStatisticalChart')
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
        name: t('title.numOfShares'),
        data: viewStore.sharesByMonth.map(item => item.shares.length).reverse(),
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        },
        type: 'line',
        areaStyle: {},
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>