// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
import axios from 'axios';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
  ['message']
)
import useUserStore from '../stores/UserStore'
import useViewStore from '../stores/ViewStore'

// 路由懒加载
const NotFount = () => import('../views/NotFount.vue');
const Home = () => import('../views/Home.vue');
const Share = () => import('../views/Share.vue');
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const List = () => import('../views/List.vue');
const Modify = () => import('../views/Modify.vue');
const Admin = () => import('../views/Admin.vue');
const Overview = () => import('../views/DashBoard/Overview.vue');
const ShareList = () => import('../views/DashBoard/ShareList.vue');
const UserList = () => import('../views/DashBoard/UserList.vue');

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '粘贴分享|主页'
    },
  },
  {
    path: '/s/:id',
    name: 'Share',
    component: Share,
    meta: {
      title: '粘贴分享|分享详情'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '粘贴分享|登陆'
    },
  },
  {
    path: '/reg',
    name: 'Register',
    component: Register,
    meta: {
      title: '粘贴分享|注册'
    },
  },
  {
    path: '/List',
    name: 'List',
    component: List,
    meta: {
      title: '粘贴分享|分享列表'
    },
  },
  {
    path: '/modify',
    name: 'Modify',
    component: Modify,
    meta: {
      title: '粘贴分享|修改分享'
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: '粘贴分享|管理后台'
    },
    beforeEnter: async (to, from) => {
      const userType = await autoLogin();
      if (userType === 'admin' || userType === 'super') {
        // const viewStore = useViewStore();
        // viewStore.getView();
        return true;
      } else {
        message.error(`${localStorage.getItem("username") || "游客"}没有权限访问管理后台!`);
        return { name: 'Home' }
      }
    },
    // 默认重定向
    redirect: "/admin/overview",
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
        meta: {
          title: '管理后台|概览'
        },
      },
      {
        path: 'shares',
        name: 'ShareList',
        component: ShareList,
        meta: {
          title: '管理后台|分享列表'
        },
      },
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: {
          title: '管理后台|用户列表'
        },
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFount',
    component: NotFount,
    meta: {
      title: '粘贴分享|404'
    },
  }
];

// 创建路由并暴露其返回值
const router = createRouter({
  // 配置路由模式hash和history
  history: createWebHashHistory(),
  // 使用路由配置
  routes
})

router.beforeEach(async (to) => {
  await autoLogin();
})

router.afterEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
})

const autoLogin = async () => {
  const userStore = useUserStore();
  if (userStore.token && !userStore.isLogin && localStorage.getItem("remember") == '1') {
    // 当没有处于登陆状态且有token，且之前登陆时勾选了记住并自动登录，则进行自动登录
    try {
      const res = await axios.post('/api/autoLogin', {}, {
        timeout: 5000
      });
      const result = res.data;
      if (result.code === '0000' && result.data.username) {
        userStore.username = result.data.username;
        userStore.userType = result.data.userType;
        userStore.isLogin = true;
        if (localStorage.getItem("username") !== userStore.username) {
          localStorage.setItem("username", userStore.username);
        }
      } else {
        // 如果出错则删除本地token
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
          userStore.token = "";
        }
      }
    } catch (err) { } finally {
      userStore.isCompleteLogin = true;
    }
  } else {
    if (!userStore.isCompleteLogin) {
      userStore.isCompleteLogin = true;
    }
  }
  return userStore.userType;
}







export default router
