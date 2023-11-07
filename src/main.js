import { createApp, computed } from 'vue'
import '@/style.css'
import App from '@/App.vue'
const app = createApp(App)

// 导入并使用pinia
import { createPinia } from 'pinia'
app.use(createPinia())
import useUserStore from '@/stores/UserStore'
const userStore = useUserStore();

// 导入路由
import router from '@/router'
app.use(router)

// message等
import {
  createDiscreteApi,
} from "naive-ui";
const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
  {
    configProviderProps: computed(() => userStore.themeConfigProviderProps)
  }
)
// 提供全局的message等提示、信息弹窗
app.provide('message', message);
app.provide('notification', notification);
app.provide('dialog', dialog);
app.provide('loadingBar', loadingBar);

// 国际化
import i18n from '@/i18n'
app.use(i18n)

app.mount('#app')
