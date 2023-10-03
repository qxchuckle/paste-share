<template>
  <n-space justify="center">
    <n-space justify="center">
      <n-tag type="success">{{ share_info.language ? share_info.language : "Text" }}</n-tag>
      <n-tag> {{ formatDateTime(share_info.time) }} </n-tag>
      <n-tag type="info"> 访问量 {{ visits }} </n-tag>
    </n-space>
    <n-space justify="center">
      <n-popconfirm :negative-text="null" @positive-click="deleteShare" positive-text="确认" v-if="allowControl || allowDelete">
        <template #trigger>
          <div>
            <n-button type="error" size="small">删除</n-button>
          </div>
        </template>
        是否删除该分享
      </n-popconfirm>
      <n-popconfirm :negative-text="null" @positive-click="modifyShare" positive-text="确认" v-if="allowControl">
        <template #trigger>
          <div>
            <n-button type="warning" size="small">修改</n-button>
          </div>
        </template>
        是否修改该分享
      </n-popconfirm>
      <n-button type="primary" size="small" @click="copy()">复制</n-button>
      <n-button type="info" size="small" @click="shareFun()">分享</n-button>
      <n-button type="success" size="small" @click="showModal = true">二维码</n-button>
    </n-space>
    <QRCode v-model:showModal="showModal" :title="share_info.title"></QRCode>
  </n-space>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { formatDateTime } from '../../utils'
import useClipboard from 'vue-clipboard3';
const message = inject('message');
const { toClipboard } = useClipboard();
const props = defineProps(['share_info']);
const { share_info } = toRefs(props);
import QRCode from './QRCode.vue';
const showModal = ref(false);
import useUserStore from '../../stores/UserStore'
const userStore = useUserStore();
const axios = inject("axios");
import { useRouter } from "vue-router";
const router = useRouter();
import useShareStore from '../../stores/ShareStore'
const shareStore = useShareStore();

// 访问量，大于1000则显示K
const visits = computed(() => {
  let num = share_info.value.visits;
  if (num > 1000) {
    num = (num / 1000).toFixed(2);
    return `${num}K`;
  } else {
    return num;
  }
})

const allowControl = computed(() => {
  if (userStore.username && share_info.value.owner_name) {
    return share_info.value.owner_name === userStore.username;
  }
  return false;
})

const allowDelete = computed(() => {
  if(userStore.userType === "super" || userStore.userType === "admin"){
    return true;
  }
  return false;
})

const copy = async () => {
  try {
    await toClipboard(share_info.value.content);
    message.success("复制成功");
  } catch (e) {
    message.error("复制失败");
  }
}

const shareFun = async () => {
  try {
    await toClipboard(`${share_info.value.title} ${window.location.href}`);
    message.success("分享链接已复制");
  } catch (e) {
    message.error("分享链接复制失败");
  }
}

const deleteShare = async () => {
  try {
    const res = await axios.post("/api/share/delete", {
      share_id: share_info.value.share_id
    }, {
      timeout: 5000
    });
    let result = res.data;
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
      toList();
    } else {
      message.error(result.msg);
    }
  } catch (error) {
    message.error(result.msg);
  }
}

const modifyShare = async () => {
  toModify();
}

const toList = () => {
  router.push({
    name: 'List',
  })
}

const toModify = () => {
  shareStore.share_info = share_info.value;
  router.push({
    name: 'Modify',
  })
}

</script>

<style lang="scss" scoped></style>