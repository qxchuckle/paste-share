<template>
  <n-spin :show="loadShare" style="width: 100%;">
    <n-layout>
      <div class="share-container">
        <ShareContent :share_info="share_info" :isShare="isShare" :isShow="isShow"></ShareContent>
        <n-empty :description="t('description.noThisShare')" v-if="!isShow && !isShare" style="margin-top: 30px;"
          size="large">
          <template #extra>
            <n-button @click="toHome">
              {{ t('btn.toCreateShare') }}
            </n-button>
          </template>
        </n-empty>
        <n-form class="info_form" :rules="rules" :model="info" ref="formRef" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging" v-if="!isShow && isShare" autocomplete="off">
          <n-form-item path="password">
            <n-input class="password" size="large" type="password" show-password-on="click" v-model:value="info.password"
              :placeholder="t('placeholder.input.password')" autosize @keydown.enter.prevent maxlength="15" show-count
              clearable />
          </n-form-item>
        </n-form>
        <n-space justify="center" v-if="!isShow && isShare">
          <n-button @click="submit()" size="large">{{ t('btn.submitPassword') }}</n-button>
        </n-space>
      </div>
    </n-layout>
    <template #description>
      {{ t('description.load') }}
    </template>
  </n-spin>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
const message = inject('message');
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter()
import ShareContent from '@/components/Share/ShareContent.vue';
import { sendRequest } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

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
  sendRequest.get('/api/share/one', {
    params: { share_id: share_info.value.share_id, password: '' }
  }).then(result => {
    loadShare.value = false;
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
  }).catch(() => {
    message.error(t('message.error.errGetData'));
  });
})

const rules = computed(() => {
  return {
    password: [
      { required: true, message: t('tip.rules.required.password'), trigger: "blur" },
      { min: 1, max: 15, message: t('tip.rules.length.password'), trigger: "blur" }
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
    loadShare.value = true;
    sendRequest.get('/api/share/one', {
      params: { share_id: share_info.value.share_id, password: info.value.password }
    }).then(result => {
      loadShare.value = false;
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
        message.error(t('message.error.password'));
        isShow.value = false;
      }
    }).catch(() => {
      message.error(t('message.error.default'));
      loadShare.value = false;
    });
  }).catch(() => {
    message.error(t('message.error.checkInput'));
  })
}

const toHome = () => {
  router.push({
    name: 'Home',
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