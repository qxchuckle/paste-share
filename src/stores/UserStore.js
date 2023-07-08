import { defineStore } from 'pinia'
// 创建并暴露一个store
export default defineStore('UserStore', {
  // 状态
  state: () => {
    return {
      token: localStorage.getItem("token") || "",
      username: localStorage.getItem("username") || "",
      isLogin: false,
      isCompleteLogin: false,
    }
  },
  // 对状态的操作
  actions: {},
  // 相当于计算属性，传入一个store的state作为参数
  getters: {}
});