<template>
  <div class="card-box" v-if="shareList.length">
    <n-card v-for="(item, index) in shareList" class="share-card" @click="toShare(item)" size="small" hoverable>
      <div class="title">标题：{{ item.title ? item.title : '无' }}</div>
      <div class="content">内容：{{ item.content }}</div>
      <n-space align="center" class="info">
        <div>语言：{{ item.language ? item.language : 'Text' }}</div>
        <div>时间：{{ formatDateTime(item.time) }}</div>
      </n-space>
      <div class="floor">{{ (index + 1) + (shareNum * (pageNum - 1)) }}</div>
    </n-card>
  </div>
</template>

<script setup>
import { formatDateTime } from '@/utils'
const { shareList, pageNum, shareNum } = defineProps(['shareList', 'pageNum', 'shareNum']);
import { useRouter } from "vue-router"
const router = useRouter()

const toShare = (item) => {
  router.push({
    name: 'Share',
    params: {
      id: item.share_id,
    }
  })
}

</script>

<style lang="scss" scoped>
.card-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  .share-card {
    margin-bottom: 10px;
    width: calc(50% - 8px);
    position: relative;
    line-height: 1;
    cursor: pointer;

    .content {
      word-break: break-all;
      display: -webkit-inline-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      margin: 6px 0 5px;
    }

    .floor {
      color: #555555;
      z-index: 0;
      position: absolute;
      top: 2px;
      right: 5px;
      font-style: italic;
      font-size: 26px;
      line-height: 1;
      z-index: 0;
      font-weight: normal;
      opacity: 0.6;
    }
  }

  .share-card:nth-last-child(2),
  .share-card:nth-last-child(1) {
    margin-bottom: 3px;
  }

  @media screen and (max-width:800px) {
    .share-card {
      width: 100%;
    }

    .share-card:nth-last-child(2) {
      margin-bottom: 10px;
    }
  }
}
</style>