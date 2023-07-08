<template>
  <div class="container">
    <PasteForm></PasteForm>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue"
import { storeToRefs } from 'pinia'
const axios = inject("axios");
const message = inject('message');
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