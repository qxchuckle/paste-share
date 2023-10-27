<template>
  <div class="captcha-box">
    <n-form :rules="rules" :model="captcha" ref="formRef" style="flex: 1;">
      <n-form-item first path="text" label="输入验证码">
        <n-input v-model:value="captcha.text" @keydown.enter.prevent maxlength="4" show-count clearable
          :allow-input="onlyNumbersAndLettersAllowed" placeholder="不区分大小写" />
      </n-form-item>
    </n-form>
    <n-spin :show="captchaLoad">
      <n-skeleton v-if="captchaLoad" style="margin-left: 5px;" :width="150" :height="50" :sharp="false" />
      <n-popover v-else trigger="hover">
        <template #trigger>
          <div class="captcha-img" v-html="captcha.svg" @click="getCaptcha"></div>
        </template>
        <span>点击刷新验证码</span>
      </n-popover>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
const message = inject('message');
import { sendRequest } from '@/utils'

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
let rules = reactive({
  text: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    },
    { min: 4, max: 4, message: "验证码为4位", trigger: "blur" }
  ]
})
const onlyNumbersAndLettersAllowed = (value) => {
  return /^\w*$/.test(value);
}
const captchaLoad = ref(true);
const getCaptcha = async () => {
  captchaLoad.value = true;
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
    }
  } catch (error) {
    message.error("网络错误");
  }
  captchaLoad.value = false;
}

const validate = async () => {
  try {
    await formRef.value?.validate((errors) => { })
  } catch (err) {
    throw new Error('验证码输入不符合规则');
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
  }
}
</style>