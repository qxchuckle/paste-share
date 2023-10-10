<template>
  <div class="container">
    <PasteForm :config="config"></PasteForm>
  </div>
</template>

<script setup>
import PasteForm from '@/components/PasteForm.vue';

const config = {
  type: "create",
  buttonText: "创建 提交 分享",
  descriptionText: "创建中",
  apiPath: "/api/share/add",
  shareInfo: null,
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