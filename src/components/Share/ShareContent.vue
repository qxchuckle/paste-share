<template>
  <div class="content" v-if="isShow && isShare">
    <n-space justify="center" v-if="share_info.title">
      <div class="title">{{ share_info.title }}</div>
    </n-space>
    <InfoBar :share_info="share_info"></InfoBar>
    <n-card size="small" style="margin-top: 15px;">
      <div v-if="!share_info.language">
        <p class="text">{{ share_info.content }}</p>
      </div>
      <Code :language="share_info.language" :content="share_info.content"></Code>
    </n-card>
  </div>
</template>

<script setup>
import Code from './Code.vue';
import InfoBar from './InfoBar.vue';
const props = defineProps(['share_info', 'isShow', 'isShare']);
const { share_info, isShare, isShow } = toRefs(props);

</script>

<style lang="scss" scoped>
.content {
  width: 100%;

  .title {
    font-size: 24px;
    color: var(--n-text-color);
  }

  .text {
    white-space: break-spaces;
    word-break: break-all;
    word-wrap: break-word;
    text-overflow: ellipsis;
    margin: 0;
  }
}
</style>