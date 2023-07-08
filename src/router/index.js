// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
import axios from 'axios';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
  ['message']
)
import useUserStore from '../stores/UserStore'

// 路由懒加载
const Home = () => import('../views/Home.vue')
const Share = () => import('../views/Share.vue')
const Login = () => import('../views/Login.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: []
  },
  {
    path: '/s/:id',
    name: 'Share',
    component: Share,
    children: []
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
];

// 创建路由并暴露其返回值
const router = createRouter({
  // 配置路由模式hash和history
  history: createWebHashHistory(),
  // 使用路由配置
  routes
})

router.beforeEach((to) => {
  const userStore = useUserStore();
  if (userStore.token && !userStore.isLogin && localStorage.getItem("remember") == '1') {
    // 当没有处于登陆状态且有token，且之前登陆时勾选了记住并自动登录，则进行自动登录
    axios.post('/api/autoLogin', {
      timeout: 5000
    }).then((res) => {
      const result = res.data;
      if (result.code === '0000' && result.data.username) {
        userStore.username = result.data.username;
        userStore.isLogin = true;
        if (localStorage.getItem("username") !== userStore.username) {
          localStorage.setItem("username", userStore.username);
        }
      } else {
        // 如果出错则删除本地token
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }
      }
    }).catch((err) => { })
  }
})


export default router
