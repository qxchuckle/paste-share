<template>
  <n-spin :show="loadShare">
    <div class="share-container">
      <div class="content" v-if="isShow">
        <n-space justify="center" v-if="share_info.title">
          <div class="title">{{ share_info.title }}</div>
        </n-space>
        <n-space justify="center">
          <n-tag type="success">{{ share_info.language ? share_info.language : "Text" }}</n-tag>
          <n-tag> {{ dayjs(Number(share_info.time)).format("YYYY-MM-DD HH:MM") }} </n-tag>
          <n-button type="primary" size="small" @click="copy()">复制</n-button>
          <n-button type="info" size="small" @click="shareFun()">分享</n-button>
        </n-space>
        <n-divider />
        <div v-if="!share_info.language">
          <p>{{ share_info.content }}</p>
        </div>
        <n-config-provider :hljs="hljs" style="overflow: auto">
          <n-code :code="share_info.content" show-line-numbers language="javascript"
            v-if="share_info.language == 'javascript'" />
          <n-code :code="share_info.content" show-line-numbers language="json" v-if="share_info.language == 'json'" />
          <n-code :code="share_info.content" show-line-numbers language="cpp" v-if="share_info.language == 'cpp'" />
          <n-code :code="share_info.content" show-line-numbers language="python" v-if="share_info.language == 'python'" />
          <n-code :code="share_info.content" show-line-numbers language="java" v-if="share_info.language == 'java'" />
          <n-code :code="share_info.content" show-line-numbers language="markdown"
            v-if="share_info.language == 'markdown'" />
          <n-code :code="share_info.content" show-line-numbers language="go" v-if="share_info.language == 'go'" />
        </n-config-provider>
      </div>
      <n-form class="info_form" :rules="rules" :model="info" ref="formRef" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" v-if="!isShow" autocomplete="off">
        <n-form-item path="password">
          <n-input class="password" size="large" type="password" show-password-on="click" v-model:value="info.password"
            placeholder="请输入密码" autosize @keydown.enter.prevent />
        </n-form-item>
      </n-form>
      <n-space justify="center" v-if="!isShow">
        <n-button @click="submit()" size="large">提交密码</n-button>
      </n-space>
    </div>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue"
import dayjs from 'dayjs';
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router"
const router = useRouter()
const route = useRoute()
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();

// 代码高亮
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import cpp from 'highlight.js/lib/languages/cpp'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import markdown from 'highlight.js/lib/languages/markdown'
import go from 'highlight.js/lib/languages/go'
// 注册代码高亮
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('go', go)

const loadShare = ref(true);
const isShow = ref(true)

const share_info = ref({
  title: '',
  time: '',
  content: '',
  language: '',
  share_id: '',
});
const formRef = ref(null);
const info = ref({
  password: "",
})

onMounted(() => {
  share_info.value.share_id = route.params.id;
  const options = {
    method: 'GET',
    url: '/api/share/one',
    params: { share_id: share_info.value.share_id, password: '' },
  };
  axios.request(options).then(res => {
    loadShare.value = false;
    const result = res.data;
    if (result.data) {
      share_info.value.title = result.data.title;
      share_info.value.time = result.data.time;
      share_info.value.content = result.data.content;
      share_info.value.language = result.data.language;
    } else {
      isShow.value = false;
    }
  }).catch(() => { });
})

const rules = computed(() => {
  return {
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      { min: 1, max: 15, message: "密码长度1到15", trigger: "blur" }
    ]
  }
})

function submit() {
  let fromAble = true;
  formRef.value?.validate((errors) => {
    if (errors) {
      fromAble = false;
    }
  }).then(() => {
    if (!fromAble) return;
    // console.log(info.value);
    loadShare.value = true;
    const options = {
      method: 'GET',
      url: '/api/share/one',
      params: { share_id: share_info.value.share_id, password: info.value.password },
    };
    axios.request(options).then(res => {
      loadShare.value = false;
      const result = res.data;
      if (result.data) {
        share_info.value.title = result.data.title;
        share_info.value.time = result.data.time;
        share_info.value.content = result.data.content;
        share_info.value.language = result.data.language;
        isShow.value = true;
      } else {
        loadShare.value = false;
        message.error("密码错误");
        isShow.value = false;
      }
    }).catch(() => {
      message.error("出错了");
      loadShare.value = false;
    });
  }).catch(() => {
    message.error("请检查输入框");
  })
}

const copy = async () => {
  try {
    await toClipboard(share_info.value.content);
    message.success("复制成功");
  } catch (e) {
    message.error("复制失败");
  }
}

const shareFun = async () => {
  try {
    await toClipboard(window.location.href);
    message.success("分享链接已复制");
  } catch (e) {
    message.error("分享链接复制失败");
  }
}

</script>

<style lang="scss" scoped>
.share-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;

  .content {
    width: 100%;
  }

  .title {
    font-size: 24px;
    color: #363636;
  }

  .info_form {
    padding-top: 20px;
    margin: 0 auto;
    width: fit-content;

    .password {
      min-width: 300px;
    }

    @media screen and (max-width:600px) {
      .password {
        width: 100%;
      }
    }
  }
}
</style>