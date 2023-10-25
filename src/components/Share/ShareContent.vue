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
    <n-space class="report-box" justify="center">
      <n-popconfirm @positive-click="reportShare">
        <template #trigger>
          <div class="report-txt">
            <n-icon :component="ShieldHalf" :depth="1" color="#FF5151" />
            <span style="margin-left: 2px;">非法内容举报</span>
          </div>
        </template>
        是否举报该分享
      </n-popconfirm>
    </n-space>
  </div>
</template>

<script setup>
import Code from './Code.vue';
import InfoBar from './InfoBar.vue';
const props = defineProps(['share_info', 'isShow', 'isShare']);
const { share_info, isShare, isShow } = toRefs(props);
import { ShieldHalf } from "@vicons/ionicons5";
const message = inject('message');

const reportShare = () => {
  message.success('举报成功');
}

</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  margin: 10px 0 15px;

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

.report-box {
  color: #FF5151;
  font-size: 14px;
  margin-top: 5px;

  .report-txt {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
  }
}
</style>