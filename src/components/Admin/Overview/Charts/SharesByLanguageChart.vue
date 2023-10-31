<template>
  <DataChart :option="option"></DataChart>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
import { use } from 'echarts/core';
import { TooltipComponent, GridComponent, MarkLineComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
use([TooltipComponent, GridComponent, BarChart, CanvasRenderer, MarkLineComponent]);
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();

const sharesByLanguage = computed(() => {
  return viewStore.sharesByLanguage.sort((a, b) => b.shares.length - a.shares.length);
});

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
      text: t('title.languageTypeStatistics')
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
        data: sharesByLanguage.value.map(item => item.language === "text" ? t('label.text') : item.language),
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
        name: t('title.numOfShares'),
        type: 'bar',
        barWidth: '60%',
        label: {
          show: true,
          position: 'inside'
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        },
        data: sharesByLanguage.value.map(item => item.shares.length)
      }
    ]
  }
})

</script>

<style lang="scss" scoped></style>