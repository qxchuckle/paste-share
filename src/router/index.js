// 导入创建路由必要的方法
import { createRouter, createWebHashHistory } from "vue-router";
import axios from 'axios';
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
  ['message']
)
// 路由懒加载
const Home = () => import('../components/Home.vue')
const Test = () => import('../components/Test.vue')

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[]
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    children:[]
  }
];

// 创建路由并暴露其返回值
export default createRouter({
  // 配置路由模式hash和history
  history: createWebHashHistory(),
  // 使用路由配置
  routes
})