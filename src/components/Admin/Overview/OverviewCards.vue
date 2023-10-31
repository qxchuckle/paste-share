<template>
  <div class="overview-box">
    <DataCard class="card" :title="t('title.totalNumOfUsers')" :suffix="t('suffix.users')"
      :number="viewStore.users.length"></DataCard>
    <DataCard class="card" :title="t('title.totalNumOfShares')" :suffix="t('suffix.shares')"
      :number="viewStore.shares.length"></DataCard>
    <DataCard class="card" :title="t('title.totalNumOfVisits')" :suffix="t('suffix.visits')"
      :number="viewStore.totalVisits"></DataCard>
    <DataCard class="card" :title="t('title.numOfActiveUsers')" :suffix="t('suffix.activeUsers')"
      :number="viewStore.activeUsers.length">
    </DataCard>
    <DataCard class="card" :title="t('title.numOfTouristShares')" :suffix="t('suffix.touristSharing')"
      :number="viewStore.numberOfTouristShares"></DataCard>
    <DataCard class="card" :title="t('title.recentlyCreatedShares')" :suffix="t('suffix.recentSharing')"
      :number="viewStore.activeShares.length"></DataCard>
  </div>
</template>

<script setup>
import DataCard from "@/components/Admin/Overview/DataCard.vue";
import useViewStore from '@/stores/ViewStore'
const viewStore = useViewStore();
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

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