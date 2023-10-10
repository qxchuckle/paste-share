<template>
  <div class="container">
    <PasteForm :config="config"></PasteForm>
  </div>
</template>

<script setup>
import PasteForm from '@/components/PasteForm.vue';
import useShareStore from '@/stores/ShareStore'
const shareStore = useShareStore();

const config = {
  type: "modify",
  buttonText: "确认修改",
  descriptionText: "修改中",
  apiPath: "/api/share/modify",
  shareInfo: shareStore.share_info
}

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