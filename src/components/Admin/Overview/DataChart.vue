<template>
  <n-scrollbar x-scrollable trigger="none">
    <v-chart class="chart" :option="option" autoresize theme="echartsTheme"/>
  </n-scrollbar>
</template>

<script setup>
import VChart from "vue-echarts";
const { option } = defineProps(['option']);
import { registerTheme } from 'echarts/core';
import theme from "@/assets/echartsTheme.json";
registerTheme("echartsTheme", theme);

</script>

<style lang="scss" scoped>
.chart {
  height: 400px;
  min-width: 800px;
  margin-bottom: 10px;
}
</style>