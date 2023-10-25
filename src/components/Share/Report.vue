<template>
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
</template>

<script setup>
import { ShieldHalf } from "@vicons/ionicons5";
const message = inject('message');
const props = defineProps(['share_id']);

const reportShare = () => {
  message.success(`举报${props.share_id}成功`);
}
</script>

<style lang="scss" scoped>
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