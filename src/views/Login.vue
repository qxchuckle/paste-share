<template>
  <div id="login-panel">
    <n-spin :show="spinShow">
      <n-card title="登陆">
        <n-form :rules="rules" :model="user" ref="formRef">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="user.username" placeholder="输入用户名" @keydown.enter.prevent maxlength="15" show-count clearable/>
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="user.password" placeholder="输入密码" type="password" show-password-on="click"
              @keydown.enter.prevent maxlength="18" show-count clearable/>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-checkbox v-model:checked="user.remember" label="记住并自动登录" />
          <n-button @click="login">登陆</n-button>
        </template>
      </n-card>
      <template #description>
        登陆中
      </template>
    </n-spin>
  </div>
</template>

<script setup>
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
// 登陆
const login = async () => {
  let formAble = true;
  try {
    // 表单规则验证
    await formRef.value?.validate((errors) => {
      if (errors) {
        formAble = false;
      }
    })
    // 发送登陆请求
    spinShow.value = true;
    const res = await axios.post('/api/login', {
      username: user.username,
      password: user.password
    }, {
      timeout: 5000
    });

    let result = res.data;
    spinShow.value = false;
    // console.log(result);

    // 登陆成功则保存token
    if (result.code === '0000') {
      message.success(result.msg);
      userStore.$patch(state => {
        state.username = result.data.username;
        state.token = result.data.token;
        state.isLogin = true;
      });
      // 记住我
      if (user.remember) {
        localStorage.setItem("username", user.username);
        // localStorage.setItem("password", user.password);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("remember", user.remember ? 1 : 0);
      } else {
        localStorage.removeItem("username");
        // localStorage.removeItem("password");
        localStorage.removeItem("token");
        localStorage.removeItem("remember");
      }
      router.push({
        name: 'Home',
      })
    } else {
      message.error(result.msg);
    }
  } catch (error) {
    spinShow.value = false;
    message.error("请检查输入框");
  }
};
</script>

<style lang="scss" scoped>
#login-panel {
  max-width: 500px;
  margin: 0 auto;
}
</style>