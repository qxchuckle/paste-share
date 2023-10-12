<template>
  <div id="auth-panel">
    <n-spin :show="spinShow">
      <n-card :title="config.title">
        <n-form :rules="rules" :model="user" ref="formRef">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="user.username" placeholder="输入用户名" @keydown.enter.prevent maxlength="15" show-count
              clearable :allow-input="noSpace" />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="user.password" placeholder="输入密码" type="password" show-password-on="click"
              @keydown.enter.prevent maxlength="18" show-count clearable :allow-input="onlyNumbersAndLettersAllowed"
              @input="handlePasswordInput" />
          </n-form-item>
          <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码"
            v-if="config.type === 'reg'">
            <n-input v-model:value="user.reenteredPassword" :disabled="!user.password" type="password"
              show-password-on="click" @keydown.enter.prevent maxlength="18" show-count clearable
              :allow-input="onlyNumbersAndLettersAllowed" />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="user.remember" label="记住并自动登录" v-if="config.type === 'login'" />
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
import { ref, reactive, inject } from "vue";
// 注入
const message = inject('message');
import { sendRequest } from '@/utils'

const rPasswordFormItemRef = ref(null);
const user = reactive({
  username: localStorage.getItem("username") || "",
  password: "",
  remember: localStorage.getItem("remember") == 1,
  reenteredPassword: null,
})

let rules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 15, message: "用户名长度2到15", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度6到18", trigger: "blur" }
  ]
})

const handlePasswordInput = () => {
  if (user.reenteredPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
  }
}

if (config.type === 'reg') {
  rules.reenteredPassword = [
    {
      required: true,
      message: "请再次输入密码",
      trigger: ["input", "blur"]
    },
    {
      validator(rule, value) {
        return !!user.password && user.password.startsWith(value) && user.password.length >= value.length;
      },
      message: "两次密码输入不一致",
      trigger: "input"
    },
    {
      validator(rule, value) {
        return value === user.password;
      },
      message: "两次密码输入不一致",
      trigger: ["blur", "password-input"]
    }
  ]
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
    // 发送请求
    spinShow.value = true;
    const result = await sendRequest.post(config.apiPath, {
      username: user.username,
      password: user.password
    });
    spinShow.value = false;
    // console.log(result);

    if (result.code === '0000') {
      // 处理结果
      config.resultHandle(result, user);
    } else {
      message.error(result.msg);
    }
  } catch (error) {
    spinShow.value = false;
    // console.error(error)
    message.error("请检查输入框");
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
  margin: 0 auto;
  padding: 0 5px;
  width: 100%;
  margin-top: 20px;
}
</style>