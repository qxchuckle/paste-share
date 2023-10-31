<template>
  <div class="container">
    <PasteForm :config="config"></PasteForm>
  </div>
</template>

<script setup>
import PasteForm from '@/components/PasteForm.vue';
import { computed } from "vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const config = computed(()=>({
  type: "create",
  buttonText: t('btn.createShare'),
  descriptionText: t('description.createShareLoad'),
  apiPath: "/api/share/add",
  shareInfo: null,
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