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
    },
    async getShares() {
      try {
        const res = await axios.get('/api/view/shares', {}, {
          timeout: 5000
        });
        const result = res.data;
        if (result.code === '0000') {
          this.shares = result.data.shares;
        }
      } catch (err) { }
    },
    async getUsers() {
      try {
        const res = await axios.get('/api/view/users', {}, {
          timeout: 5000
        });
        const result = res.data;
        if (result.code === '0000') {
          this.users = result.data.users;
        }
      } catch (err) { }
    }
  },
  // 相当于计算属性，传入一个store的state作为参数
  getters: {
    // 获取有创建过分享的用户名列表，用于数据列表过滤
    shareUsernames(state){
      return [...new Set(state.shares.map((item)=>{
        return item.user.username;
      }))]
    },
    // 获取现有分类涉及到的语言类型列表，用于数据列表过滤
    shareLanguages(state){
      return [...new Set(state.shares.map((item)=>{
        return item.language;
      }))]
    },
    // 获取存在的用户类型
    userTypes(state){
      return [...new Set(state.users.map((item)=>{
        let type;
        switch (item.userType) {
          case 'admin':
            type = '管理员';
            break;
          case 'super':
            type = '超级管理员';
            break;
          case 'user':
            type = '普通用户';
            break;
        }
        return type;
      }))]
    },
  }
});

