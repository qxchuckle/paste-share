<template>
  <div class="charts-box">
    <SharesByDayChart></SharesByDayChart>
    <sharesByLanguageChart></sharesByLanguageChart>
  </div>
</template>

<script setup>
import SharesByDayChart from "@/components/Admin/Overview/Charts/SharesByDayChart.vue"
import sharesByLanguageChart from "@/components/Admin/Overview/Charts/sharesByLanguageChart.vue";
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