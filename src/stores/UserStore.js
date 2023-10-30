import { defineStore } from 'pinia'
import {
  darkTheme,
  lightTheme,
  zhCN,
  enUS
} from "naive-ui";

// 创建并暴露一个store
export default defineStore('UserStore', {
  // 状态
  state: () => {
    return {
      token: localStorage.getItem("token") || "",
      username: localStorage.getItem("username") || "",
      userType: "",
      isLogin: false,
      isCompleteLogin: false,
      theme: (() => {
        const autoSwitchTheme = JSON.parse(localStorage.getItem("autoSwitchTheme")) ?? true
        const currentHour = new Date().getHours();
        if ((!autoSwitchTheme && localStorage.getItem("theme") === "dark") || (autoSwitchTheme && (currentHour >= 18 || currentHour < 6))) {
          return "dark"
        } else {
          return "light"
        }
      })(),
      language: localStorage.getItem("language") || "zh"
    }
  },
  // 对状态的操作
  actions: {
    logout() {
      this.token = "";
      this.username = "";
      this.userType = "";
      this.isLogin = false;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    },
    handleTheme(theme = null) {
      if (theme) {
        this.theme = theme;
        return;
      }
      if (this.theme === "light")
        this.theme = "dark";
      else
        this.theme = "light";
    },
    handleThemeByTime() {
      const currentHour = new Date().getHours();
      if (currentHour >= 18 || currentHour < 6) {
        this.handleTheme('dark');
      } else {
        this.handleTheme('light');
      }
    },
    handleLanguage(lang) {
      this.language = lang || "zh";
    }
  },
  // 相当于计算属性，传入一个store的state作为参数
  getters: {
    themeConfig(state) {
      return state.theme === "light" ? lightTheme : darkTheme
    },
    themeConfigProviderProps(state) {
      return {
        theme: state.themeConfig
      }
    },
    languageConfig(state) {
      const langList = {
        zh: zhCN,
        en: enUS,
      }
      return langList[state.language] || zhCN
    }
  }
});