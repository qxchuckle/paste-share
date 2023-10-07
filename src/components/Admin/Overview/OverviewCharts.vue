<template>
  <div class="charts-box">
    <SharesByDayChart></SharesByDayChart>
  </div>
</template>

<script setup>
import SharesByDayChart from "@/components/Admin/Overview/Charts/SharesByDayChart.vue"
</script>

<style lang="scss" scoped>
.charts-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .chart {
    height: 400px;
    min-width: 800px;
  }
}
</style>