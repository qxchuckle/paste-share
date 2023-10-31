<template>
  <div class="captcha-box">
    <n-form :rules="rules" :model="captcha" ref="formRef" style="flex: 1;">
      <n-form-item first path="text" :label="t('label.captcha')">
        <n-input v-model:value="captcha.text" @keydown.enter.prevent maxlength="4" show-count clearable
          :allow-input="onlyNumbersAndLettersAllowed" :placeholder="t('placeholder.input.captcha')" />
      </n-form-item>
    </n-form>
    <n-spin :show="captchaLoad">
      <n-skeleton v-if="captchaLoad" style="margin-left: 5px;" :width="150" :height="50" :sharp="false" />
      <n-popover v-else trigger="hover">
        <template #trigger>
          <div class="captcha-img">
            <div v-if="!captchaLoadError" v-html="captcha.svg" @click="getCaptcha"></div>
            <n-space v-else justify="center">
              <n-tag @click="getCaptcha" type="error">
                <template #icon>
                  <n-icon :component="CloseCircleOutline" />
                </template>
                {{ t('text.clickToReload') }}
              </n-tag>
            </n-space>
          </div>
        </template>
        <span>{{ t('text.clickToReloadCaptcha') }}</span>
      </n-popover>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
const message = inject('message');
import { sendRequest } from '@/utils'
import { CloseCircleOutline } from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const captcha = reactive({
  id: null,
  svg: null,
  text: null
})

onMounted(async () => {
  captcha.id = sessionStorage.getItem('captcha_id');
  await getCaptcha();
})

const formRef = ref(null);
let rules = computed(() => ({
  text: [
    {
      required: true,
      message: t('tip.rules.required.captcha'),
      trigger: "blur",
    },
    { min: 4, max: 4, message: t('tip.rules.length.captcha'), trigger: "blur" }
  ]
}));
const onlyNumbersAndLettersAllowed = (value) => {
  return /^\w*$/.test(value);
}
const captchaLoad = ref(true);
const captchaLoadError = ref(false);
const getCaptcha = async () => {
  captchaLoad.value = true;
  captchaLoadError.value = false;
  clearValue();
  try {
    const result = await sendRequest.get('/api/captcha', {
      params: { id: captcha.id, height: 50, width: 150 }
    });
    if (result.code === '0000') {
      // 处理结果
      if (!captcha.id || result.data.id !== sessionStorage.getItem('captcha_id')) {
        captcha.id = result.data.id;
        sessionStorage.setItem('captcha_id', result.data.id);
      }
      captcha.svg = result.data.svg;
    } else {
      message.error(result.msg);
      captchaLoadError.value = true;
    }
  } catch (error) {
    message.error(t('message.error.networkError'));
    captchaLoadError.value = true;
  }
  captchaLoad.value = false;
}

const validate = async () => {
  try {
    await formRef.value?.validate((errors) => { })
  } catch (err) {
    throw new Error(t('message.error.nonCompliantRules'));
  }
}

const clearValue = () => {
  captcha.text = "";
}

defineExpose({ getCaptcha, captcha, validate, clearValue })

</script>

<style lang="scss" scoped>
.captcha-box {
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;

  .captcha-img {
    margin-left: 5px;
    min-width: 150px;
    width: 150;
    height: 50;
  }
}
</style>