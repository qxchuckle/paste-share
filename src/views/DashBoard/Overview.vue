<template>
  <div style="padding: 5px 10px">
    <div class="overview-box">
      <n-card class="card">
        <n-statistic label="用户总数" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.users.length" />
          <template #suffix>
            位用户
          </template>
        </n-statistic>
      </n-card>
      <n-card class="card">
        <n-statistic label="分享总数" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.shares.length" />
          <template #suffix>
            个分享
          </template>
        </n-statistic>
      </n-card>
      <n-card class="card">
        <n-statistic label="总访问量" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.totalVisits" />
          <template #suffix>
            次访问
          </template>
        </n-statistic>
      </n-card>
      <n-card class="card">
        <n-statistic label="活跃用户数" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.activeUsers.length" />
          <template #suffix>
            位活跃用户
          </template>
        </n-statistic>
      </n-card>
      <n-card class="card">
        <n-statistic label="游客分享数" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.numberOfTouristShares" />
          <template #suffix>
            个游客分享
          </template>
        </n-statistic>
      </n-card>
      <n-card class="card">
        <n-statistic label="最近创建的分享" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.activeShares.length" />
          <template #suffix>
            个近期分享
          </template>
        </n-statistic>
      </n-card>
    </div>

    <div class="charts-box">
      <n-scrollbar x-scrollable>
        <v-chart class="chart" :option="sharesByDayChart" autoresize/>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, computed } from "vue"
import useViewStore from '../../stores/ViewStore'
const viewStore = useViewStore();
import { useLoadingBar } from 'naive-ui'
const loadingBar = useLoadingBar();
import VChart from "vue-echarts";

onBeforeMount(async () => {
  loadingBar.start();
  await viewStore.getView();
  loadingBar.finish();
});

// import { use } from 'echarts/core'
// import { BarChart } from 'echarts/charts'
// import {
//   TitleComponent,
//   TooltipComponent,
//   GridComponent
// } from 'echarts/components'
// import { CanvasRenderer } from 'echarts/renderers'

// use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer])

// const sharesByDayChart = computed(() => {
//   return {
//     title: { text: "分享统计图/天" },
//     tooltip: {},
//     xAxis: {
//       data: viewStore.sharesByDay.map(item => item.day).reverse(),
//     },
//     yAxis: {},
//     series: [
//       {
//         name: "分享数量",
//         type: "bar",
//         data: viewStore.sharesByDay.map(item => item.shares.length).reverse(),
//       },
//     ],
//   }
// });

import * as echarts from 'echarts/core';
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

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const sharesByDayChart = computed(() => {
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
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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

<style lang="scss" scoped>
.overview-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  &::after {
    content: "";
    flex-basis: calc(33% - 5px);
  }


  .card {
    width: calc(33% - 5px);
    margin-bottom: 10px;
  }
}

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


@media screen and (max-width:800px) {
  .overview-box {
    .card {
      width: calc(50% - 5px);
    }
  }

}

@media screen and (max-width:500px) {
  .overview-box {
    .card {
      width: calc(100% - 5px);
    }
  }

}
</style>