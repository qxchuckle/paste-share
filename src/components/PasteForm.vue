<template>
  <n-spin :show="loadAddShare">
    <n-form class="info_form" :rules="rules" :model="info" ref="formRef" label-placement="left" label-width="auto"
      require-mark-placement="right-hanging" autocomplete="off">
      <n-form-item path="title" label="标题" size="large">
        <n-input v-model:value="info.title" placeholder="请输入标题" @keydown.enter.prevent maxlength="60" show-count
          clearable />
      </n-form-item>
      <n-form-item path="language" label="语言" size="large">
        <n-select class="select" v-model:value="info.language" :options="select_options" />
      </n-form-item>
      <div class="password-box">
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
        <n-form-item class="password-label" path="password" label="密码" size="large" v-show="password_switch">
          <n-input class="password" type="password" show-password-on="click" v-model:value="info.password"
            placeholder="请输入密码" autosize @keydown.enter.prevent maxlength="15" show-count clearable />
        </n-form-item>
      </div>
      <n-form-item path="content" label="内容" size="large">
        <n-input v-model:value="info.content" type="textarea" @keydown.tab.prevent="addTab" placeholder="粘贴或输入文本、代码"
          :autosize="{
            minRows: 9
          }" maxlength="9999" show-count />
      </n-form-item>
      <n-space justify="center">
        <n-button @click="submit()" size="large">{{ config.buttonText }}</n-button>
      </n-space>
    </n-form>
    <template #description>
      {{ config.descriptionText }}
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, computed, nextTick, onMounted } from "vue"
const message = inject('message');
import { useRouter } from "vue-router"
const router = useRouter()
const { config } = defineProps(['config']);
import useShareStore from '@/stores/ShareStore'
const shareStore = useShareStore();
import useUserStore from '@/stores/UserStore';
const userStore = useUserStore();
import { sendRequest } from '@/utils'

const loadAddShare = ref(false);
const formRef = ref(null);
const info = ref({
  title: "",
  language: "",
  password: "",
  content: "",
})
const password_switch = ref(false);

onMounted(() => {
  if (config.shareInfo) {
    info.value.title = config.shareInfo.title;
    info.value.language = config.shareInfo.language;
    info.value.password = config.shareInfo.password;
    info.value.content = config.shareInfo.content;
    if (config.shareInfo.password) {
      password_switch.value = true;
    }
  }
})

const rules = computed(() => {
  return {
    title: [
      { min: 0, max: 60, message: "标题长度0到60", trigger: "blur" }
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
    label: "TypeScript",
    value: "typescript",
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
  {
    label: "Rust",
    value: "rust",
  },
  {
    label: "CSS",
    value: "css",
  },
  {
    label: "Yaml",
    value: "yaml",
  },
]

function submit() {
  // 如果是修改模式，要判断分享的修改权限
  if (config.type === "modify" && shareStore.share_info.owner_name !== userStore.username) {
    message.error("没有修改权限");
    toList();
    return;
  }
  let fromAble = true;
  formRef.value?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(() => {
    if (!fromAble) return;
    // console.log(info.value);
    loadAddShare.value = true;
    if (!password_switch.value) {
      info.value.password = ""
    }
    sendRequest.post(config.apiPath, {
      ...info.value,
      share_id: config.shareInfo ? config.shareInfo.share_id : "",
    }).then(result => {
      loadAddShare.value = false;
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

const toList = () => {
  router.push({
    name: 'List',
  })
}

</script>

<style lang="scss" scoped>
.info_form {
  margin: 15px 0;

  .password-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .password-label {
    margin-left: 25px;
  }

  .password {
    min-width: 300px;
  }

  @media screen and (max-width:600px) {
    .password-label {
      margin-left: 0;
    }

    .password-box {
      display: block;
    }

    .password {
      min-width: 100%;
    }
  }

}
</style>