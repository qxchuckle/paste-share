import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
const app = createApp(App)

// 导入并使用pinia
import { createPinia } from 'pinia'
app.use(createPinia())
import useUserStore from './stores/UserStore'
const userStore = useUserStore();
import { computed, ref } from "vue";

// axios
import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

// 拦截器
axios.interceptors.request.use((config) => {
  config.headers.token = userStore.token;
  return config;
})
app.provide('axios', axios);

// 导入路由
import router from './router'
app.use(router)

// message等
import {
  createDiscreteApi,
  darkTheme,
  lightTheme
} from "naive-ui";
const themeRef = ref("light");
const configProviderPropsRef = computed(() => ({
  theme: themeRef.value === "light" ? lightTheme : darkTheme
}));
function handleTheme(theme = null) {
  if (theme) {
    themeRef.value = theme;
    return;
  }
  if (themeRef.value === "light")
    themeRef.value = "dark";
  else
    themeRef.value = "light";
}
const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
  {
    configProviderProps: configProviderPropsRef
  }
)
// 提供全局的message等提示、信息弹窗
app.provide('handleTheme', handleTheme);
app.provide('message', message);
app.provide('notification', notification);
app.provide('dialog', dialog);
app.provide('loadingBar', loadingBar);

app.mount('#app')
