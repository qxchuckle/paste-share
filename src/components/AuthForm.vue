<template>
  <div id="auth-panel">
    <n-spin :show="spinShow">
      <n-card :title="config.title">
        <n-form :rules="rules" :model="user" ref="formRef">
          <n-form-item path="username" label="用户名" first>
            <n-input v-model:value="user.username" placeholder="输入用户名" @keydown.enter.prevent maxlength="15" show-count
              clearable :allow-input="noSpace" />
          </n-form-item>
          <n-form-item path="password" label="密码" first>
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
          <div class="captcha-box" v-if="config.type === 'reg'">
            <n-form-item first path="captchaText" label="输入验证码" style="flex: 1;">
              <n-input v-model:value="user.captchaText" @keydown.enter.prevent maxlength="4" show-count clearable
                :allow-input="onlyNumbersAndLettersAllowed" placeholder="不区分大小写" />
            </n-form-item>
            <n-spin :show="captchaLoad">
              <n-popover trigger="hover">
                <template #trigger>
                  <div class="captcha-img" v-html="captcha.svg" @click="getCaptcha"></div>
                </template>
                <span>点击刷新验证码</span>
              </n-popover>
            </n-spin>
          </div>
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
import { ref, reactive, inject, onMounted } from "vue";
// 注入
const message = inject('message');
import { sendRequest } from '@/utils'

const captcha = reactive({
  id: null,
  svg: null,
})
const captchaLoad = ref(true);
const getCaptcha = async () => {
  captchaLoad.value = true;
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

onMounted(async () => {
  if (config.type === 'reg') {
    captcha.id = sessionStorage.getItem('captcha_id');
    await getCaptcha();
  }
})

const rPasswordFormItemRef = ref(null);
const user = reactive({
  username: localStorage.getItem("username") || "",
  password: "",
  remember: localStorage.getItem("remember") == 1,
  reenteredPassword: null,
  captchaText: "",
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
  rules.captchaText = [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    }
  ];
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
    try {
      const parameter = (() => {
        if (config.type === 'reg') {
          return {
            username: user.username,
            password: user.password,
            captcha_id: captcha.id,
            captcha_text: user.captchaText
          }
        } else {
          return {
            username: user.username,
            password: user.password
          }
        }
      })();
      const result = await sendRequest.post(config.apiPath, parameter);
      spinShow.value = false;
      // console.log(result);
      if (result.code === '0000') {
        // 处理结果
        config.resultHandle(result, user);
      } else {
        message.error(result.msg);
        if (config.type === 'reg') {
          getCaptcha();
        }
      }
    } catch (error) {
      spinShow.value = false;
      if (config.type === 'reg') {
        getCaptcha();
      }
      message.error("网络错误");
    }
  } catch (error) {
    spinShow.value = false;
    if (config.type === 'reg') {
      getCaptcha();
    }
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