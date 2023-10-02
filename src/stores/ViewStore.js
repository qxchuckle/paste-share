import { defineStore } from 'pinia'
import axios from 'axios';

export default defineStore('ViewStore', {
  // 状态
  state: () => {
    return {
      shares: [],
      users: [],
    }
  },
  // 对状态的操作
  actions: {
    async getView() {
      try {
        const res = await axios.get('/api/view', {}, {
          timeout: 5000
        });
        const result = res.data;
        if (result.code === '0000') {
          this.shares = result.data.shares;
          this.users = result.data.users;
        }
      } catch (err) { }
    }
  },
  // 相当于计算属性，传入一个store的state作为参数
  getters: {}
});

