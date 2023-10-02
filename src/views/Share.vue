<template>
  <n-spin :show="loadShare">
    <n-layout>
      <div class="share-container">
        <ShareContent :share_info="share_info" :isShare="isShare" :isShow="isShow"></ShareContent>
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
      </div>
    </n-layout>
    <template #description>
      加载中
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
const axios = inject("axios");
const message = inject('message');
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
import ShareContent from '../components/Share/ShareContent.vue';

const loadShare = ref(true);
const isShare = ref(true);
const isShow = ref(true);

const share_info = ref({
  title: '',
  time: '',
  content: '',
  language: '',
  share_id: '',
  visits: '',
  owner_name: '', // 记录当前分享所有者
  password: '',
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
      share_info.value.visits = result.data.visits;
      share_info.value.owner_name = result.data.owner_name;
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
        share_info.value.owner_name = result.data.owner_name;
        share_info.value.password = info.value.password; // 保存用户输入的正确密码，用户修改时展示
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

</script>

<style lang="scss" scoped>
.share-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100%;

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