<template>
  <div class="container">
    <PasteForm></PasteForm>
  </div>
</template>

<script setup>
import PasteForm from '../components/PasteForm.vue';
</script>

<style lang="scss" scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;
}
</style>