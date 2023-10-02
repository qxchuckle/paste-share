import { defineStore } from 'pinia'

export default defineStore('ShareStore', {
  // 状态
  state: () => {
    return {
      share_info: "", // 临时存放分享的信息，中转作用
    }
  },
  // 对状态的操作
  actions: {
    clearInfo() {
      this.share_info = "";
    }
  },
  // 相当于计算属性，传入一个store的state作为参数
  getters: {}
});
