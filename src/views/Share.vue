<template>
  <div class="container">
    <h1>share</h1>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue"
import { storeToRefs } from 'pinia'
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()





</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;
}
</style>