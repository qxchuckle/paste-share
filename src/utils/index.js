import axios from 'axios';
import useUserStore from '@/stores/UserStore'

export function formatDateTime(timestamp, format = 'YYYY-MM-DD HH:MM', precision = 'minute') {
  // 将时间戳转换为日期对象
  var date = new Date(Number(timestamp));

  // 获取日期的各个部分
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
  var day = String(date.getDate()).padStart(2, '0');
  var hours = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');

  // 根据精确度选择要包含的部分
  var formattedDate = '';
  switch (precision) {
    case 'year':
      formattedDate = year;
      break;
    case 'month':
      formattedDate = year + '-' + month;
      break;
    case 'day':
      formattedDate = year + '-' + month + '-' + day;
      break;
    case 'hour':
      formattedDate = year + '-' + month + '-' + day + ' ' + hours;
      break;
    case 'minute':
    default:
      formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
      break;
  }

  // 根据传入的格式进行替换
  formattedDate = format.replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('MM', minutes);

  return formattedDate;
}


// axios封装
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'
})
request.interceptors.request.use((config) => {
  const userStore = useUserStore();
  config.headers.token = userStore.token;
  return config;
})
request.defaults.timeout = 5000;

export const sendRequest = {
  async get(url, option = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await request.get(url, option);
        resolve(res.data);
      } catch (error) {
        // 出错重试
        if (option.retry && option.retry > 0) {
          try {
            const result = await sendRequest.get(url, {
              ...option,
              retry: option.retry - 1
            });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(error);
        }
      }
    });
  },
  async post(url, data = {}, option = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await request.post(url, data, option);
        resolve(res.data);
      } catch (error) {
        // 出错重试
        if (option.retry && option.retry > 0) {
          try {
            const result = await sendRequest.post(url, data, {
              ...option,
              retry: option.retry - 1
            });
            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(error);
        }
      }
    });
  }
}