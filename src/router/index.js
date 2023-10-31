// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
import { sendRequest } from '@/utils'
import { createDiscreteApi } from 'naive-ui'
import useUserStore from '@/stores/UserStore'
import { computed } from 'vue'

// 路由懒加载
const NotFount = () => import('@/views/NotFount.vue');
const Home = () => import('@/views/Home.vue');
const Share = () => import('@/views/Share.vue');
const Login = () => import('@/views/Login.vue');
const Register = () => import('@/views/Register.vue');
const List = () => import('@/views/List.vue');
const Modify = () => import('@/views/Modify.vue');
const Admin = () => import('@/views/Admin.vue');
const Overview = () => import('@/views/DashBoard/Overview.vue');
const ShareList = () => import('@/views/DashBoard/ShareList.vue');
const UserList = () => import('@/views/DashBoard/UserList.vue');

import { i18nGlobal as i18n } from '@/i18n'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: i18n.t('router.Home'),
      breadcrumb: {
        click: true,
        type: "tag"
      }
    },
  },
  {
    path: '/s/:id',
    name: 'Share',
    component: Share,
    meta: {
      title: i18n.t('router.Share'),
      breadcrumb: {
        click: true,
        type: "tag"
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: i18n.t('router.Login'),
      breadcrumb: {
        click: true,
        type: "tag"
      }
    },
  },
  {
    path: '/reg',
    name: 'Register',
    component: Register,
    meta: {
      title: i18n.t('router.Register'),
      breadcrumb: {
        click: true,
        type: "tag"
      }
    },
  },
  {
    path: '/List',
    name: 'List',
    component: List,
    meta: {
      title: i18n.t('router.List'),
      breadcrumb: {
        click: true,
        type: "tag"
      }
    },
  },
  {
    path: '/modify',
    name: 'Modify',
    component: Modify,
    meta: {
      title: i18n.t('router.Modify'),
      breadcrumb: {
        click: true,
        type: "tag"
      }
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: i18n.t('router.Admin'),
      breadcrumb: {
        click: false,
        type: "text"
      }
    },
    beforeEnter: async (to, from) => {
      const userType = await autoLogin();
      if (userType === 'admin' || userType === 'super') {
        return true;
      } else {
        const userStore = useUserStore();
        const { message } = createDiscreteApi(
          ['message'],
          {
            configProviderProps: computed(() => userStore.themeConfigProviderProps)
          }
        );
        message.error(`${localStorage.getItem("username") || i18n.t('type.tourist')}${i18n.t('message.error.unableAccessAdmin')}`);
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
          title: i18n.t('router.Overview'),
          breadcrumb: {
            click: true,
            type: "text"
          }
        },
      },
      {
        path: 'shares',
        name: 'ShareList',
        component: ShareList,
        meta: {
          title: i18n.t('router.ShareList'),
          breadcrumb: {
            click: true,
            type: "text"
          }
        },
      },
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: {
          title: i18n.t('router.UserList'),
          breadcrumb: {
            click: true,
            type: "text"
          }
        },
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFount',
    component: NotFount,
    meta: {
      title: i18n.t('router.NotFount'),
      breadcrumb: true
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

let theLoadingBar = null;

router.beforeEach(async (to) => {
  if (!theLoadingBar) {
    const userStore = useUserStore();
    const { loadingBar } = createDiscreteApi(
      ['loadingBar'],
      {
        configProviderProps: computed(() => userStore.themeConfigProviderProps)
      }
    );
    theLoadingBar = loadingBar;
  }
  theLoadingBar?.start();
  await autoLogin();
})

router.afterEach((to, from) => {
  theLoadingBar?.finish();
  if (to.meta.title) {
    document.title = `${i18n.t('projectName')}|${i18n.t(`router.${to.name}`)}`;
  } else {
    document.title = i18n.t('projectName');
  }
})

const autoLogin = async () => {
  const userStore = useUserStore();
  if (userStore.token && !userStore.isLogin && localStorage.getItem("remember") == '1') {
    const { message } = createDiscreteApi(
      ['message'],
      {
        configProviderProps: computed(() => userStore.themeConfigProviderProps)
      }
    );
    // 当没有处于登陆状态且有token，且之前登陆时勾选了记住并自动登录，则进行自动登录
    try {
      const result = await sendRequest.post('/api/autoLogin');
      if (result.code === '0000' && result.data.username) {
        userStore.username = result.data.username;
        userStore.userType = result.data.userType;
        userStore.isLogin = true;
        if (localStorage.getItem("username") !== userStore.username) {
          localStorage.setItem("username", userStore.username);
        }
        message.success(`${i18n.t('message.success.welcome')} ${userStore.username}`);
      } else {
        // 如果出错则删除本地token
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
          userStore.token = "";
          message.warning(i18n.t('message.error.tokenOverdue'));
        } else {
          message.error(i18n.t('message.error.autoLoginFailed'));
        }
      }
    } catch (err) {
      message.error(i18n.t('message.error.autoLoginFailed'));
    } finally {
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
