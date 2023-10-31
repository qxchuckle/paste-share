<template>
  <div id="auth-panel">
    <n-spin :show="spinShow">
      <n-card :title="config.title">
        <n-form :rules="rules" :model="user" ref="formRef">
          <n-form-item path="username" :label="t('label.username')" first>
            <n-input v-model:value="user.username" :placeholder="t('placeholder.input.username')" @keydown.enter.prevent
              maxlength="15" show-count clearable :allow-input="noSpace" />
          </n-form-item>
          <n-form-item path="password" :label="t('label.password')" first>
            <n-input v-model:value="user.password" :placeholder="t('placeholder.input.password')" type="password"
              show-password-on="click" @keydown.enter.prevent maxlength="18" show-count clearable
              :allow-input="onlyNumbersAndLettersAllowed" @input="handlePasswordInput" />
          </n-form-item>
          <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" :label="t('label.rPassword')"
            v-if="config.type === 'reg'">
            <n-input v-model:value="user.reenteredPassword" :placeholder="t('placeholder.input.password')"
              :disabled="!user.password" type="password" show-password-on="click" @keydown.enter.prevent maxlength="18"
              show-count clearable :allow-input="onlyNumbersAndLettersAllowed" />
          </n-form-item>
          <Captcha ref="captchaRef" v-if="config.type === 'reg'"></Captcha>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="user.remember" :label="t('label.rememberLogin')" v-if="config.type === 'login'" />
          <n-space justify="center">
            <n-button @click="submit">{{ config.buttonText }}</n-button>
          </n-space>
        </template>
      </n-card>
      <template #description>
        {{ config.descriptionText }}
      </template>
    </n-spin>
  </div>
</template>

<script setup>
const { config } = defineProps(['config']);
import { ref, reactive, inject, computed } from "vue";
// 注入
const message = inject('message');
import { sendRequest } from '@/utils'
import Captcha from "@/components/Captcha.vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const rPasswordFormItemRef = ref(null);
const captchaRef = ref(null);
const user = reactive({
  username: localStorage.getItem("username") || "",
  password: "",
  remember: localStorage.getItem("remember") == 1,
  reenteredPassword: null
})

const rules = computed(() => {
  const rules = {
    username: [
      { required: true, message: t('tip.rules.required.username'), trigger: "blur" },
      { min: 2, max: 15, message: t('tip.rules.length.username'), trigger: "blur" }
    ],
    password: [
      { required: true, message: t('tip.rules.required.password'), trigger: "blur" },
      { min: 6, max: 18, message: t('tip.rules.required.userPassword'), trigger: "blur" }
    ]
  }
  if (config.type === 'reg') {
    rules.reenteredPassword = [
      {
        required: true,
        message: t('tip.rules.required.rePassword'),
        trigger: ["input", "blur"]
      },
      {
        validator(rule, value) {
          return !!user.password && user.password.startsWith(value) && user.password.length >= value.length;
        },
        message: t('tip.rules.error.passwordInconsistency'),
        trigger: "input"
      },
      {
        validator(rule, value) {
          return value === user.password;
        },
        message: t('tip.rules.error.passwordInconsistency'),
        trigger: ["blur", "password-input"]
      }
    ]
  }
  return rules;
});

const handlePasswordInput = () => {
  if (user.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
}

const formRef = ref(null);
const spinShow = ref(false);
// 提交
const submit = async () => {
  let formAble = true;
  try {
    // 表单规则验证
    await formRef.value?.validate((errors) => {
      if (errors) {
        formAble = false;
      }
    })
    await captchaRef.value?.validate();
    // 发送请求
    spinShow.value = true;
    try {
      const parameter = {
        username: user.username,
        password: user.password,
      };
      if (config.type === 'reg') {
        parameter.captcha_id = captchaRef.value.captcha.id;
        parameter.captcha_text = captchaRef.value.captcha.text;
      }
      const result = await sendRequest.post(config.apiPath, parameter);
      spinShow.value = false;
      if (result.code === '0000') {
        // 处理结果
        config.resultHandle(result, user);
      } else {
        message.error(result.msg);
        captchaRef.value?.getCaptcha();
      }
    } catch (error) {
      spinShow.value = false;
      message.error(t('message.error.networkError'));
    }
  } catch (error) {
    spinShow.value = false;
    message.error(t('message.error.checkInput'));
  }
};

const noSpace = (value) => {
  return !/\s/.test(value);
}

const onlyNumbersAndLettersAllowed = (value) => {
  return /^\w*$/.test(value);
}

</script>

<style lang="scss" scoped>
#auth-panel {
  max-width: 510px;
  margin: 20px auto;
  padding: 0 5px;
  width: 100%;
}
</style>