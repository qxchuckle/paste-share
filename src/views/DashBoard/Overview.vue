<template>
  <div class="main">
    <n-space>
      <n-card>
        <n-statistic label="用户总数" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.users.length" />
          <template #suffix>
            位用户
          </template>
        </n-statistic>
        <n-space vertical>
          花时间、花精力、花心思，愿你每一份努力都不负所望
        </n-space>
      </n-card>

      <n-card>
        <n-statistic label="分享总数" tabular-nums>
          <n-number-animation :from="0" :to="viewStore.shares.length" />
          <template #suffix>
            个分享
          </template>
        </n-statistic>
        <n-space vertical>
          花时间、花精力、花心思，愿你每一份努力都不负所望
        </n-space>
      </n-card>

    </n-space>

  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeMount } from "vue"
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
import useViewStore from '../../stores/ViewStore'
const viewStore = useViewStore();

onBeforeMount(() => {
  viewStore.getView();
});




</script>

<style lang="scss" scoped></style>