import { defineStore } from 'pinia'
import axios from 'axios';
import { formatDateTime } from '../utils'

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
    // 获取分享的总访问量
    totalVisits(state) {
      return state.shares.reduce((result, item) => {
        return result + item.visits;
      }, 0);
    },
    // 获取活跃用户信息
    activeUsers(state) {
      const judgmentDays = 30;
      const thirtyDaysAgo = Date.now() - (judgmentDays * 24 * 60 * 60 * 1000);
      return state.users.map((item) => {
        if (Number(item.lastLoginTime) > thirtyDaysAgo) {
          return item;
        }
      });
    },
    // 获取游客分享数
    numberOfTouristShares(state) {
      return state.shares.reduce((result, item) => {
        return item.user.username === "" ? result + 1 : result;
      }, 0);
    },
    // 获取最近创建的分享信息
    activeShares(state) {
      const judgmentDays = 30;
      const thirtyDaysAgo = Date.now() - (judgmentDays * 24 * 60 * 60 * 1000);
      return state.shares.map((item) => {
        if (Number(item.time) > thirtyDaysAgo) {
          return item;
        }
      });
    },
    // 获取有创建过分享的用户名列表，用于数据列表过滤
    shareUsernames(state) {
      return state.shares.reduce((result, item) => {
        if (!result.includes(item.user.username)) {
          result.push(item.user.username);
        }
        return result;
      }, []);
    },
    // 获取现有分类涉及到的语言类型列表，用于数据列表过滤
    shareLanguages(state) {
      return state.shares.reduce((result, item) => {
        if (!result.includes(item.language)) {
          result.push(item.language);
        }
        return result;
      }, []);
    },
    // 获取存在的用户类型
    userTypes(state) {
      const typeMap = {
        'admin': '管理员',
        'super': '超级管理员',
        'user': '普通用户',
      };
      return state.users.reduce((result, item) => {
        const userType = typeMap[item.userType];
        if (userType && !result.includes(userType)) {
          result.push(userType);
        }
        return result;
      }, []);
    },
    // 按以天为基准，分类所有分享
    sharesByDay(state) {
      const categorizedShares = {};
      state.shares.forEach((share) => {
        const formattedDate = formatDateTime(share.time, 'YYYY-MM-DD');
        if (!categorizedShares[formattedDate]) {
          categorizedShares[formattedDate] = {
            day: formattedDate,
            shares: [],
          };
        }
        categorizedShares[formattedDate].shares.push(share);
      })
      return Object.values(categorizedShares);
    }
  }
});

