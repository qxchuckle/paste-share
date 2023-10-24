<template>
  <n-space vertical class="charts-load" v-if="!viewStore.shares.length && !viewStore.users.length">
    <n-skeleton text height="20px" :sharp="false" width="60%" style="margin-top: 30px;"/>
    <n-skeleton text height="30px" :sharp="false" width="80%" />
    <n-skeleton text height="40px" :sharp="false" width="100%" />
    <n-skeleton text height="20px" :sharp="false" width="60%" style="margin-top: 30px;"/>
    <n-skeleton text height="30px" :sharp="false" width="80%" />
    <n-skeleton text height="40px" :sharp="false" width="100%" />
  </n-space>
  <div class="charts-box" v-else>
    <SharesByDayChart></SharesByDayChart>
    <SharesByMonthChart></SharesByMonthChart>
    <SharesByLanguageChart></SharesByLanguageChart>
  </div>
</template>

<script setup>
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import SharesByDayChart from "@/components/Admin/Overview/Charts/SharesByDayChart.vue"
import SharesByLanguageChart from "@/components/Admin/Overview/Charts/SharesByLanguageChart.vue";
import SharesByMonthChart from "@/components/Admin/Overview/Charts/SharesByMonthChart.vue";
</script>

<style lang="scss" scoped>
.charts-load {
  padding: 10px;
}

.charts-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  width: calc(100% - 5px);
}
</style>