<template>
  <div id="auth-panel">
    <n-spin :show="spinShow">
      <n-card :title="config.title">
        <n-form :rules="rules" :model="user" ref="formRef">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="user.username" placeholder="输入用户名" @keydown.enter.prevent maxlength="15" show-count
              clearable />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="user.password" placeholder="输入密码" type="password" show-password-on="click"
              @keydown.enter.prevent maxlength="18" show-count clearable />
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
import { ref, reactive, inject } from "vue"
// 导入路由器和路由
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
// pinia操作
import useUserStore from '../stores/UserStore'
const userStore = useUserStore();
// 注入
const axios = inject("axios");
const message = inject('message');

let rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 15, message: "用户名长度2到15", trigger: "blur" }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 18, message: "密码长度6到18", trigger: "blur" }
  ]
}

const formRef = ref(null);

const user = reactive({
  username: localStorage.getItem("username") || "",
  password: "",
  remember: localStorage.getItem("remember") == 1,
})
let spinShow = ref(false);
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
    let apiPath;
    if (config.type === 'login') {
      apiPath = "/api/login";
    } else if (config.type === 'reg') {
      apiPath = "/api/reg";
    }
    spinShow.value = true;
    const res = await axios.post(apiPath, {
      username: user.username,
      password: user.password
    }, {
      timeout: 5000
    });

    let result = res.data;
    spinShow.value = false;
    // console.log(result);

    if (result.code === '0000') {
      // 处理结果
      if (config.type === 'login') {
        loginResultHandle(result);
      } else if (config.type === 'reg') {
        regResultHandle(result);
      }
    } else {
      message.error(result.msg);
    }
  } catch (error) {
    spinShow.value = false;
    message.error("请检查输入框");
  }
};

function loginResultHandle(result) {
  message.success(result.msg);
  userStore.$patch(state => {
    state.username = result.data.username;
    state.token = result.data.token;
    state.userType = result.data.userType;
    state.isLogin = true;
  });
  // 记住我
  if (user.remember) {
    localStorage.setItem("username", user.username);
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("remember", user.remember ? 1 : 0);
  } else {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("remember");
  }
  router.push({
    name: 'Home',
  })
}

function regResultHandle(result) {
  message.success(result.msg);
  router.push({
    name: 'Login',
  })
}

</script>

<style lang="scss" scoped>
#auth-panel {
  max-width: 510px;
  margin: 0 auto;
  padding: 0 5px;
}
</style>