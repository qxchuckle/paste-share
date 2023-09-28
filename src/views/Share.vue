<template>
  <n-spin :show="loadShare">
    <n-layout>
      <div class="share-container">
        <div class="content" v-if="isShow && isShare">
          <n-space justify="center" v-if="share_info.title">
            <div class="title">{{ share_info.title }}</div>
          </n-space>
          <n-space justify="center">
            <n-space justify="center">
              <n-tag type="success">{{ share_info.language ? share_info.language : "Text" }}</n-tag>
              <n-tag> {{ dayjs(Number(share_info.time)).format("YYYY-MM-DD") }} </n-tag>
              <n-tag type="info"> 访问量 {{ visits }} </n-tag>
            </n-space>
            <n-space justify="center">
              <n-button type="primary" size="small" @click="copy()">复制</n-button>
              <n-button type="info" size="small" @click="shareFun()">分享</n-button>
              <n-button type="success" size="small" @click="showModal = true">二维码</n-button>
            </n-space>
          </n-space>
          <n-card size="small" style="margin-top: 15px;">
            <div v-if="!share_info.language">
              <p class="text">{{ share_info.content }}</p>
            </div>
            <Code :language="share_info.language" :content="share_info.content"></Code>
          </n-card>
        </div>
        <n-empty description="没有该分享" v-if="!isShow && !isShare"></n-empty>
        <n-form class="info_form" :rules="rules" :model="info" ref="formRef" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging" v-if="!isShow && isShare" autocomplete="off">
          <n-form-item path="password">
            <n-input class="password" size="large" type="password" show-password-on="click" v-model:value="info.password"
              placeholder="请输入密码" autosize @keydown.enter.prevent maxlength="15" show-count clearable />
          </n-form-item>
        </n-form>
        <n-space justify="center" v-if="!isShow && isShare">
          <n-button @click="submit()" size="large">提交密码</n-button>
        </n-space>
        <n-modal v-model:show="showModal" preset="dialog" transform-origin="center">
          <template #header>
            <div>{{ share_info.title || '当前分享' }}的二维码</div>
          </template>
          <n-space justify="center">
            <div class="qrcode">
              <qrcode-vue :value="currentURL" :size="200"></qrcode-vue>
            </div>
          </n-space>
        </n-modal>
      </div>
    </n-layout>
    <template #description>
      加载中
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import dayjs from 'dayjs';
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import useClipboard from 'vue-clipboard3';
const { toClipboard } = useClipboard();
import QrcodeVue from 'qrcode.vue';
import Code from '../components/Code.vue';

const loadShare = ref(true);
const isShare = ref(true);
const isShow = ref(true);
const currentURL = window.location.href;
const showModal = ref(false);

const share_info = ref({
  title: '',
  time: '',
  content: '',
  language: '',
  share_id: '',
  visits: '',
});
const formRef = ref(null);
const info = ref({
  password: "",
})

// 访问量，大于1000则显示K
const visits = computed(() => {
  let num = share_info.value.visits;
  if(num > 1000){
    num = (num / 1000).toFixed(2);
    return `${num}K`;
  }else{
    return num;
  }
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
      share_info.value.visits = result.data.visits;
    } else {
      if (result.code === "3000") {
        isShare.value = false;
      }
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
        share_info.value.visits = result.data.visits;
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

    .text {
      white-space: break-spaces;
      word-break: break-all;
      word-wrap: break-word;
      text-overflow: ellipsis;
      margin: 0;
    }
  }

  .title {
    font-size: 24px;
    color: var(--n-text-color);
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

.qrcode {
  padding: 5px;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}


</style>