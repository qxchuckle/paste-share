<template>
  <n-spin :show="loadList" style="width: 100%;">
    <n-layout>
      <div class="list-container">
        <div class="search" v-if="shareList.length || keyword || loadList">
          <n-input v-model:value="keyword" :placeholder="t('placeholder.input.shareListSearch')"
            style="flex: 1;"></n-input>
          <n-button type="primary" ghost @click="search" style="margin-left: 10px;">{{ t('btn.search') }}</n-button>
          <n-button type="primary" ghost @click="reLoad" style="margin-left: 10px;">{{ t('btn.reset') }}</n-button>
        </div>
        <n-empty :description="t('description.none')" v-if="!shareList.length && !loadList" style="padding: 30px 0;"
          size="large">
          <template #extra>
            <n-button @click="toHome" v-if="!keyword">
              {{ t('btn.toCreateShare') }}
            </n-button>
          </template>
        </n-empty>
        <n-scrollbar style="height: calc(100vh - 175px);width: calc(100% + 12px);" trigger="none">
          <n-space v-if="loadList" vertical class="charts-load">
            <n-skeleton text height="20px" :sharp="false" width="60%" style="margin-top: 5px;" />
            <n-skeleton text height="30px" :sharp="false" width="80%" />
            <n-skeleton text height="30px" :sharp="false" width="100%" />
            <n-skeleton text height="30px" :sharp="false" width="100%" />
            <n-skeleton text height="20px" :sharp="false" width="60%" style="margin-top: 20px;" />
            <n-skeleton text height="30px" :sharp="false" width="80%" />
            <n-skeleton text height="30px" :sharp="false" width="100%" />
            <n-skeleton text height="30px" :sharp="false" width="100%" style="margin-bottom: 10px;" />
          </n-space>
          <ShareCards v-else :shareList="shareList" :pageNum="page" :shareNum="shareNum" style="padding-right: 12px;">
          </ShareCards>
        </n-scrollbar>
      </div>
      <n-space justify="center" v-if="shareList.length || loadList">
        <n-pagination @update:page="updatePage" v-model:page="page" :page-count="pageCount"
          :show-size-picker="showSizePicker" :page-sizes="[10, 20, 30]" v-model:page-size="shareNum"
          @update:page-size="updatePageSize" :show-quick-jumper="showQuickJumper" :page-slot="7" />
      </n-space>
    </n-layout>
    <template #description>
      {{ t('description.load') }}
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted, computed, onBeforeUnmount, onUpdated } from "vue"
import { sendRequest } from '@/utils'
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
import useUserStore from '@/stores/UserStore'
const userStore = useUserStore();
import ShareCards from '@/components/List/ShareCards.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const loadList = ref(false);
const shareList = ref([]);

const showQuickJumper = ref(true);
const showSizePicker = ref(true);

function handleWindowSizeChange() {
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (screenWidth < 600) {
    showQuickJumper.value = false;
    if (screenWidth < 300) {
      showSizePicker.value = false;
    } else {
      showSizePicker.value = true;
    }
  } else {
    showQuickJumper.value = true;
  }
}

onMounted(() => {
  loadShareList();
  handleWindowSizeChange();
  window.addEventListener("resize", handleWindowSizeChange);
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
})

const toHome = () => {
  router.push({
    name: 'Home',
  })
}

const page = ref(Number(route.query?.page) || 1); // 当前受控页
const shareSize = ref(1); // 分享总数
const pageCount = computed(() => {
  return Math.ceil(shareSize.value / shareNum.value);
}); // 总页数
const shareNum = ref(Number(route.query?.size) || 20); // 每页显示的分享数量
const keyword = ref(route.query?.keyword || ""); // 搜索关键字

const loadShareList = () => {
  loadList.value = true;
  sendRequest.get('/api/share', {
    params: {
      page: page.value,
      shareNum: shareNum.value,
      keyword: keyword.value,
    },
  }).then(result => {
    loadList.value = false;
    if (result.code === '0000') {
      shareList.value = result.data.shareList;
      shareSize.value = result.data.shareSize;
    } else {
      message.error(t('message.error.identityVerificationFailed'));
      userStore.logout();
      router.push({
        name: 'Login',
      })
    }
  }).catch(() => {
    message.error(t('message.error.errGetData'));
  });
}

const search = () => {
  page.value = 1;
  router.push({
    query: {
      page: 1,
      size: shareNum.value,
      keyword: keyword.value
    }
  })
}

const reLoad = () => {
  router.push({
    query: {
      page: 1,
      size: 20,
      keyword: ""
    }
  })
}

const updatePage = (value) => {
  router.push({
    query: {
      page: value,
      size: shareNum.value,
      keyword: keyword.value
    }
  })
}

const updatePageSize = (value) => {
  router.push({
    query: {
      page: 1,
      size: value,
      keyword: keyword.value
    }
  })
}

watch(() => route.query, () => {
  page.value = Number(route.query?.page) || 1;
  shareNum.value = Number(route.query?.size) || 20
  keyword.value = route.query?.keyword || "";
  if (route.name === "List") {
    loadShareList();
  }
})

</script>

<style lang="scss" scoped>
.list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px 6px;
  height: 100%;
  margin-top: 10px;

  .search {
    margin-bottom: 10px;
    width: 100%;
    display: flex;
  }
}
</style>