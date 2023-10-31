<template>
  <n-space justify="center">
    <n-space justify="center">
      <n-tag type="success">{{ share_info.language ? share_info.language : t('label.text') }}</n-tag>
      <n-tag> {{ formatDateTime(share_info.time) }} </n-tag>
      <n-tag type="info">{{ `${t('text.visits')} ${visits}` }}</n-tag>
    </n-space>
    <n-space justify="center">
      <n-popconfirm @positive-click="deleteShare" v-if="allowControl || allowDelete">
        <template #trigger>
          <div>
            <n-button type="error" size="small">{{ t('btn.delete') }}</n-button>
          </div>
        </template>
        {{ t('text.deleteShareOrNot') }}
      </n-popconfirm>
      <n-popconfirm @positive-click="modifyShare" v-if="allowControl">
        <template #trigger>
          <div>
            <n-button type="warning" size="small">{{ t('btn.modify') }}</n-button>
          </div>
        </template>
        {{ t('text.modifyShareOrNot') }}
      </n-popconfirm>
      <n-button type="primary" size="small" @click="copy()">{{ t('btn.copy') }}</n-button>
      <n-button type="info" size="small" @click="shareFun()">{{ t('btn.share') }}</n-button>
      <n-button type="success" size="small" @click="showModal = true">{{ t('btn.qrCode') }}</n-button>
    </n-space>
    <QRCode v-model:showModal="showModal" :title="share_info.title"></QRCode>
  </n-space>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import { formatDateTime, sendRequest } from '@/utils'
import useClipboard from 'vue-clipboard3';
const message = inject('message');
const { toClipboard } = useClipboard();
const props = defineProps(['share_info']);
const { share_info } = toRefs(props);
import QRCode from '@/components/Share/QRCode.vue';
const showModal = ref(false);
import useUserStore from '@/stores/UserStore'
const userStore = useUserStore();
import { useRouter } from "vue-router";
const router = useRouter();
import useShareStore from '@/stores/ShareStore'
const shareStore = useShareStore();
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

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
  if (userStore.userType === "super" || userStore.userType === "admin") {
    return true;
  }
  return false;
})

const copy = async () => {
  try {
    await toClipboard(share_info.value.content);
    message.success(t('message.success.copyContent'));
  } catch (e) {
    message.error(t('message.error.copyContent'));
  }
}

const shareFun = async () => {
  try {
    await toClipboard(`${share_info.value.title} ${window.location.href}`);
    message.success(t('message.success.copyLink'));
  } catch (e) {
    message.error(t('message.error.copyLink'));
  }
}

const deleteShare = async () => {
  try {
    const result = await sendRequest.post("/api/share/delete", {
      share_id: share_info.value.share_id
    });
    if (result.code === '0000') {
      // 处理结果
      message.success(result.msg);
      if (router.options.history.state.back.includes("admin")) {
        router.go(-1);
      } else {
        toList();
      }
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