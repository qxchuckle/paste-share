<template>
  <div class="charts-box">
    <SharesByDayChart></SharesByDayChart>
    <SharesByMonthChart></SharesByMonthChart>
    <SharesByLanguageChart></SharesByLanguageChart>
  </div>
</template>

<script setup>
import SharesByDayChart from "@/components/Admin/Overview/Charts/SharesByDayChart.vue"
import SharesByLanguageChart from "@/components/Admin/Overview/Charts/SharesByLanguageChart.vue";
import SharesByMonthChart from "@/components/Admin/Overview/Charts/SharesByMonthChart.vue";
</script>

<style lang="scss" scoped>
.charts-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
}
</style>