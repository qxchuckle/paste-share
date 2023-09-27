<template>
  <n-spin :show="loadAdmin">
    <n-layout>
      <div class="admin-container">
        <n-empty description="你什么也找不到" v-if="!shareList.length"></n-empty>
        <div class="card-box" v-if="shareList.length">
          <n-card v-for="(item, index) in shareList" class="share-card" @click="toShare(item)" size="small" hoverable>
            <div class="title">标题：{{ item.title ? item.title : '无' }}</div>
            <div class="content">内容：{{ item.content }}</div>
            <n-space align="center" class="info">
              <div>语言：{{ item.language ? item.language : 'Text' }}</div>
              <div>时间：{{ dayjs(Number(item.time)).format("YYYY-MM-DD HH:MM") }}</div>
            </n-space>
            <div class="floor">{{ index + 1 }}</div>
          </n-card>
        </div>
      </div>
    </n-layout>
    <template #description>
      加载中
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted } from "vue"
import dayjs from 'dayjs';
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
import useUserStore from '../stores/UserStore'
const userStore = useUserStore();

const loadAdmin = ref(false);
const shareList = ref([]);

onMounted(() => {
  loadAdmin.value = true;
  const options = {
    method: 'GET',
    url: '/api/share',
  };
  axios.request(options).then(res => {
    loadAdmin.value = false;
    const result = res.data;
    if (result.code === '0000') {
      shareList.value = result.data.shareList;
    } else {
      message.error("身份校验失败，请重新登陆");
      userStore.token = "";
      userStore.username = "";
      userStore.userType = "";
      userStore.isLogin = false;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      router.push({
        name: 'Login',
      })
    }
  }).catch(() => { });
})

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
.admin-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;

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