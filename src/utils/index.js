import axios from 'axios';

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

export const sendRequest = {
  async get(url, option = { timeout: 5000 }) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url, option);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  },
  async post(url, data = {}, option = { timeout: 5000 }) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(url, data, option);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  }
}