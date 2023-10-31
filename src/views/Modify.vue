<template>
  <div class="container">
    <PasteForm :config="config"></PasteForm>
  </div>
</template>

<script setup>
import PasteForm from '@/components/PasteForm.vue';
import useShareStore from '@/stores/ShareStore'
const shareStore = useShareStore();
import { computed } from "vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const config = computed(() => ({
  type: "modify",
  buttonText: t('btn.confirmModify'),
  descriptionText: t('description.modifyLoad'),
  apiPath: "/api/share/modify",
  shareInfo: shareStore.share_info
}));

</script>

<style lang="scss" scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;
  width: 100%;
}
</style>