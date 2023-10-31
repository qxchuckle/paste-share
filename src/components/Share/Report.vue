<template>
  <n-space class="report-box" justify="center">
    <n-popconfirm @positive-click="reportShare">
      <template #trigger>
        <div class="report-txt">
          <n-icon :component="ShieldHalf" :depth="1" color="#FF5151" />
          <span style="margin-left: 2px;">{{ t('text.reportContent') }}</span>
        </div>
      </template>
      {{ t('text.reportOrNot') }}
    </n-popconfirm>
  </n-space>
</template>

<script setup>
import { ShieldHalf } from "@vicons/ionicons5";
const message = inject('message');
const props = defineProps(['share_id']);
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const reportShare = () => {
  message.success(`${t('text.report')} ${props.share_id} ${t('text.success')}`);
}
</script>

<style lang="scss" scoped>
.report-box {
  color: #FF5151;
  font-size: 14px;
  margin-top: 5px;
  cursor: pointer;

  .report-txt {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
  }
}
</style>