<template>
  <n-space justify="center">
    <n-space justify="center">
      <n-tag type="success">{{ share_info.language ? share_info.language : "Text" }}</n-tag>
      <n-tag> {{ dayjs(Number(share_info.time)).format("YYYY-MM-DD") }} </n-tag>
      <n-tag type="info"> 访问量 {{ visits }} </n-tag>
    </n-space>
    <n-space justify="center">
      <n-button type="primary" size="small" @click="copy()">复制</n-button>
      <n-button type="info" size="small" @click="shareFun()">分享</n-button>
      <n-button type="success" size="small" @click="showModal = true">二维码</n-button>
    </n-space>
    <QRCode v-model:showModal="showModal" :title="share_info.title"></QRCode>
  </n-space>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import dayjs from 'dayjs';
import useClipboard from 'vue-clipboard3';
const message = inject('message');
const { toClipboard } = useClipboard();
const props = defineProps(['share_info']);
const { share_info } = toRefs(props);
import QRCode from './QRCode.vue';
const showModal = ref(false);

// 访问量，大于1000则显示K
const visits = computed(() => {
  let num = share_info.value.visits;
  if(num > 1000){
    num = (num / 1000).toFixed(2);
    return `${num}K`;
  }else{
    return num;
  }
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

</script>

<style lang="scss" scoped>

</style>