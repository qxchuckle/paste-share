<template>
  <n-spin :show="loadList" style="width: 100%;">
    <n-layout>
      <div class="list-container">
        <div class="search">
          <n-input v-model:value="keyword" placeholder="请输入关键字，可搜索标题、内容" style="flex: 1;"></n-input>
          <n-button type="primary" ghost @click="search" style="margin-left: 10px;">搜索</n-button>
          <n-button type="primary" ghost @click="reLoad" style="margin-left: 10px;">重置</n-button>
        </div>
        <n-empty description="你什么也找不到" v-if="!shareList.length" style="padding: 10px 0;">
          <template #extra>
            <n-button @click="toHome">
              去创建分享
            </n-button>
          </template>
        </n-empty>
        <div class="card-box" v-if="shareList.length">
          <n-card v-for="(item, index) in shareList" class="share-card" @click="toShare(item)" size="small" hoverable>
            <div class="title">标题：{{ item.title ? item.title : '无' }}</div>
            <div class="content">内容：{{ item.content }}</div>
            <n-space align="center" class="info">
              <div>语言：{{ item.language ? item.language : 'Text' }}</div>
              <div>时间：{{ formatDateTime(item.time) }}</div>
            </n-space>
            <div class="floor">{{ index + 1 }}</div>
          </n-card>
        </div>
      </div>
      <n-space justify="center" style="margin-bottom: 10px;">
        <n-pagination @update:page="loadShareList" v-model:page="page" :page-count="pageCount" />
      </n-space>
    </n-layout>
    <template #description>
      加载中
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue"
import { formatDateTime, sendRequest } from '@/utils'
const message = inject('message');
import { useRouter } from "vue-router"
const router = useRouter()
import useUserStore from '@/stores/UserStore'
const userStore = useUserStore();

const loadList = ref(false);
const shareList = ref([]);

onMounted(() => {
  loadShareList();
})

const toShare = (item) => {
  router.push({
    name: 'Share',
    params: {
      id: item.share_id,
    }
  })
}

const toHome = () => {
  router.push({
    name: 'Home',
  })
}

const page = ref(1); // 当前受控页
const shareSize = ref(1); // 分享总数
const pageCount = computed(() => {
  return Math.ceil(shareSize.value / shareNum.value);
}); // 总页数
const shareNum = ref(20); // 每页显示的分享数量
const keyword = ref(""); // 搜索关键字

const loadShareList = (newPage) => {
  loadList.value = true;
  sendRequest.get('/api/share', {
    params: {
      page: newPage || 1,
      shareNum: shareNum.value,
      keyword: keyword.value,
    },
  }).then(result => {
    loadList.value = false;
    if (result.code === '0000') {
      shareList.value = result.data.shareList;
      shareSize.value = result.data.shareSize;
    } else {
      message.error("身份校验失败，请重新登陆");
      userStore.logout();
      router.push({
        name: 'Login',
      })
    }
  }).catch(() => {
    message.error("获取列表出错");
  });
}

const search = () => {
  loadShareList();
}

const reLoad = () => {
  keyword.value = "";
  page.value = 1;
  loadShareList();
}



</script>

<style lang="scss" scoped>
.list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;
  margin-top: 10px;

  .search {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
  }

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

    @media screen and (max-width:800px) {
      .share-card {
        width: 100%;
      }
    }
  }
}
</style>