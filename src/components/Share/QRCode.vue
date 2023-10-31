<template>
  <n-modal v-model:show="localShowModal" preset="dialog" transform-origin="center">
    <template #header>
      <div>{{ t('text.qrCode') }}</div>
    </template>
    <n-space justify="center">
      <div class="qrcode">
        <qrcode-vue :value="currentURL" :size="200"></qrcode-vue>
      </div>
    </n-space>
  </n-modal>
</template>

<script setup>
import { computed } from "vue";
import QrcodeVue from 'qrcode.vue';
const props = defineProps(['showModal', 'title']);
const currentURL = window.location.href;
const emit = defineEmits(['update:showModal']);
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const localShowModal = computed({
  get() {
    return props.showModal;
  },
  set(value) {
    emit('update:showModal', value);
  }
});

</script>

<style lang="scss" scoped>
.qrcode {
  padding: 5px;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}
</style>