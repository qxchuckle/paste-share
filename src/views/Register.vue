<template>
  <div id="login-panel">
    <n-spin :show="spinShow">
      <n-card title="注册">
        <n-form :rules="rules" :model="user" ref="formRef">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="user.username" placeholder="输入用户名" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input v-model:value="user.password" placeholder="输入密码" type="password" show-password-on="click"
              @keydown.enter.prevent />
          </n-form-item>
        </n-form>
        <template #footer>
          <n-button @click="register()">注册</n-button>
        </template>
      </n-card>
      <template #description>
        登陆中
      </template>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue"
// 导入路由器和路由
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
// pinia操作
import { storeToRefs } from 'pinia'
import useUserStore from '../stores/UserStore'
const userStore = useUserStore();
// 注入
const axios = inject("axios");
const message = inject('message');
const loadingBar = inject('loadingBar');


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
  username: "",
  password: "",
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
    const res = await axios.post('/api/reg', {
      username: user.username,
      password: user.password
    }, {
      timeout: 5000
    });

    let result = res.data;
    spinShow.value = false;

    if (result.code === '0000') {
      message.success(result.msg);
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