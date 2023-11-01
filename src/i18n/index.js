import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'
const messages = {
  en,
  zh,
}
// 这是获取浏览器的语言
// const language = (navigator.language || 'zh').toLocaleLowerCase()
const i18n = createI18n({
  // 首先从缓存里拿，没有的话就用浏览器语言
  // locale: localStorage.getItem('language') || language.split('-')[0] || 'zh',
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'zh', // 设置备用语言
  messages,
  legacy: false
})

export default i18n

export const i18nGlobal = i18n.global;

