import { defineStore } from 'pinia'
import { formatDateTime, sendRequest } from '@/utils'
import { createDiscreteApi } from 'naive-ui'
const { message } = createDiscreteApi(
  ['message']
)

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
        const result = await sendRequest.get('/api/view');
        if (result.code === '0000') {
          this.shares = result.data.shares;
          this.users = result.data.users;
        }else{
          message.error(result.msg);
        }
      } catch (err) {
        message.error("获取数据出错");
      }
    },
    async getShares() {
      try {
        const result = await sendRequest.get('/api/view/shares');
        if (result.code === '0000') {
          this.shares = result.data.shares;
        }else{
          message.error(result.msg);
        }
      } catch (err) {
        message.error("获取数据出错");
      }
    },
    async getUsers() {
      try {
        const result = await sendRequest.get('/api/view/users');
        if (result.code === '0000') {
          this.users = result.data.users;
        }else{
          message.error(result.msg);
        }
      } catch (err) {
        message.error("获取数据出错");
      }
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
      return state.users.filter((item) => {
        return item.lastLoginTime && Number(item.lastLoginTime) > thirtyDaysAgo;
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
      return state.shares.filter((item) => {
        return Number(item.time) > thirtyDaysAgo;
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
    // 以天为基准，分类所有分享
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
    },
    // 以月为基准，分类所有分享
    sharesByMonth(state) {
      const categorizedShares = {};
      state.shares.forEach((share) => {
        const formattedDate = formatDateTime(share.time, 'YYYY-MM');
        if (!categorizedShares[formattedDate]) {
          categorizedShares[formattedDate] = {
            month: formattedDate,
            shares: [],
          };
        }
        categorizedShares[formattedDate].shares.push(share);
      })
      return Object.values(categorizedShares);
    },
    // 按语言类型分类所有分享
    sharesByLanguage(state) {
      const categorizedShares = {};
      state.shares.forEach((share) => {
        const language = share.language || "text";
        if (!categorizedShares[language]) {
          categorizedShares[language] = {
            language: language,
            shares: [],
          };
        }
        categorizedShares[language].shares.push(share);
      })
      return Object.values(categorizedShares);
    },
  }
});

