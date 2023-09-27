<template>
  <n-spin :show="loadAdmin">
    <div class="admin-container">
      <n-empty description="你什么也找不到" v-if="!shareList.length"></n-empty>
      <div class="card-box" v-if="shareList.length">
        <div v-for="item in shareList" class="share-card" @click="toShare(item)">
          <div class="title">标题：{{ item.title ? item.title : '无' }}</div>
          <div class="content">内容：{{ item.content }}</div>
          <n-space align="center">
            <div>语言：{{ item.language ? item.language : 'Text' }}</div>
            <div>时间：{{ dayjs(Number(item.time)).format("YYYY-MM-DD HH:MM") }}</div>
          </n-space>
        </div>
      </div>
    </div>
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
      color: #363636;
      margin-top: 10px;
      padding: 5px 10px;
      width: calc(50% - 26px);
      border: 1px solid rgb(239, 239, 245);
      border-radius: 4px;
    }
  }

  @media screen and (max-width:800px) {
    .share-card {
      width: 100%;
    }
  }
}
</style>