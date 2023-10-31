<template>
  <DataChart :option="option" style="max-height: 260px;"></DataChart>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
import { formatDateTime } from '@/utils'
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import DataChart from "@/components/Admin/Overview/DataChart.vue";
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);

function getVirtualData(year) {
  const date = +echarts.time.parse(year + '-01-01');
  const end = +echarts.time.parse(+year + 1 + '-01-01');
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
      viewStore.sharesCalendar.hasOwnProperty(formatDateTime(time, 'YYYY-MM-DD')) ? viewStore.sharesCalendar[formatDateTime(time, 'YYYY-MM-DD')].shares.length : 0
    ]);
  }
  return data;
}

const option = computed(() => {
  const year = new Date().getFullYear();
  return {
    title: {
      left: 'center',
      text: t('title.sharingCalendar')
    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: viewStore.sharesByDay.reduce(function (prev, current) {
        return (prev.shares.length > current.shares.length) ? prev : current;
      }).shares.length,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 35,
    },
    calendar: {
      top: 90,
      left: 30,
      right: 20,
      cellSize: ['auto', 18],
      range: year,
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData(year)
    }
  }
});
</script>

<style lang="scss" scoped></style>