<template>
  <DataChart :option="option"></DataChart>
</template>

<script setup>
import { computed } from "vue"
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import DataChart from "@/components/Admin/Overview/DataChart.vue";
import { use, graphic } from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const option = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '20%'];
      }
    },
    title: {
      left: 'center',
      text: '分享统计图/天'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: viewStore.sharesByDay.map(item => item.day).reverse()
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: '分享数',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
        data: viewStore.sharesByDay.map(item => item.shares.length).reverse()
      }
    ]
  }
})
</script>

<style lang="scss" scoped></style>