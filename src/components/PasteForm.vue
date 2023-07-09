<template>
  <n-spin :show="loadAddShare">
    <n-form class="info_form" :rules="rules" :model="info" ref="formRef" label-placement="left" label-width="auto"
      require-mark-placement="right-hanging" autocomplete="off">
      <n-form-item path="title" label="标题" size="large">
        <n-input v-model:value="info.title" placeholder="请输入标题" @keydown.enter.prevent maxlength="20" show-count clearable/>
      </n-form-item>
      <n-form-item path="language" label="语言" size="large">
        <n-select class="select" v-model:value="info.language" :options="select_options" />
      </n-form-item>
      <n-form-item path="password_switch" label="加密" size="large">
        <n-switch :rail-style="railStyle" v-model:value="password_switch" size="large">
          <template #checked>
            有密码
          </template>
          <template #unchecked>
            无密码
          </template>
        </n-switch>
      </n-form-item>
      <n-form-item path="password" label="密码" size="large" v-show="password_switch">
        <n-input class="password" type="password" show-password-on="click" v-model:value="info.password" placeholder="请输入密码" autosize @keydown.enter.prevent maxlength="15" show-count clearable/>
      </n-form-item>
      <n-form-item path="content" label="内容" size="large">
        <n-input v-model:value="info.content" type="textarea" @keydown.tab.prevent="addTab" placeholder="粘贴或输入文本、代码"
          :autosize="{
            minRows: 10
          }" maxlength="9999" show-count/>
      </n-form-item>
      <n-space justify="center">
        <n-button @click="submit()" size="large">创建 提交 分享</n-button>
      </n-space>
    </n-form>
  </n-spin>
</template>

<script setup>
import { ref, inject, computed, nextTick } from "vue"
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()

const loadAddShare = ref(false);
const formRef = ref(null);
const info = ref({
  title: "",
  language: "",
  password: "",
  content: "",
})
const password_switch = ref(false);

const rules = computed(() => {
  return {
    title: [
      { min: 0, max: 20, message: "标题长度0到20", trigger: "blur" }
    ],
    password: [
      { required: password_switch.value, message: "请输入密码", trigger: "blur" },
      { min: 1, max: 15, message: "密码长度1到15", trigger: "blur" }
    ],
    content: [
      { required: true, message: "请输入内容", trigger: "blur" },
      { min: 1, max: 9999, message: "内容长度1到9999", trigger: "blur" }
    ],
  }
})

function railStyle({
  focused,
  checked
}) {
  const style = {};
  if (checked) {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  } else {
    style.background = "#d03050";
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  }
  return style;
}

const select_options = [
  {
    label: "纯文本",
    value: "",
  },
  {
    label: "Markdown",
    value: "markdown",
  },
  {
    label: "C/C++",
    value: "cpp",
  },
  {
    label: "JavaScript",
    value: "javascript",
  },
  {
    label: "Json",
    value: "json",
  },
  {
    label: "Python",
    value: "python",
  },
  {
    label: "Java",
    value: "java",
  },
  {
    label: "GO",
    value: "go",
  },
]

function submit() {
  let fromAble = true;
  formRef.value?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(() => {
    if (!fromAble) return;
    // console.log(info.value);
    loadAddShare.value = true;
    if(!password_switch.value){
      info.value.password = ""
    }
    axios({
      url: '/api/share/add',
      method: 'post',
      data: {
        ...info.value
      },
      timeout: 5000
    }).then(res => {
      loadAddShare.value = false;
      let result = res.data;
      // console.log(result.data.share_id);
      if (result.code === '0000') {
        message.success(result.msg);
        router.push({
          name: 'Share',
          params: {
            id: result.data.share_id,
          }
        })
      } else {
        message.error(result.msg);
      }
    }).catch(err => {
      message.error("出错了");
      loadAddShare.value = false;
    })
  }).catch(() => {
    message.error("请检查输入框");
  })
}

// 让textarea框增加tab缩进效果，两个空格
function addTab(event) {
  console.log(event);
  const { selectionStart, selectionEnd } = event.target;
  const value = info.value.content;

  info.value.content =
    value.substring(0, selectionStart) +
    '  ' +
    value.substring(selectionEnd);

  // 更新光标位置
  nextTick(() => {
    event.target.selectionStart = event.target.selectionEnd =
      selectionStart + 2;
  });
}



</script>

<style lang="scss" scoped>
.info_form {

  .password {
    min-width: 300px;
  }

  @media screen and (max-width:600px) {
    .password {
      min-width: 100%;
    }
  }
}
</style>