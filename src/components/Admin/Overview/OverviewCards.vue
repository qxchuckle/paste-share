<template>
  <div class="overview-box">
    <DataCard class="card" title="用户总数" suffix="位用户" :number="viewStore.users.length"></DataCard>
    <DataCard class="card" title="分享总数" suffix="个分享" :number="viewStore.shares.length"></DataCard>
    <DataCard class="card" title="总访问量" suffix="次访问" :number="viewStore.totalVisits"></DataCard>
    <DataCard class="card" title="活跃用户数" suffix="位活跃用户" :number="viewStore.activeUsers.length"></DataCard>
    <DataCard class="card" title="游客分享数" suffix="个游客分享" :number="viewStore.numberOfTouristShares"></DataCard>
    <DataCard class="card" title="最近创建的分享" suffix="个近期分享" :number="viewStore.activeShares.length"></DataCard>
  </div>
</template>

<script setup>
import DataCard from "@/components/Admin/Overview/DataCard.vue";
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();

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