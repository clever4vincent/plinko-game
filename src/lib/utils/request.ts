import axios from 'axios';
// import { toast } from '@zerodevx/svelte-toast';
import { failure, toast, warning } from './my-toast';
const service = axios.create({
  baseURL: 'https://api.done-pay.com/app',
  timeout: 10 * 1000, // 请求超时时间
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});
service.interceptors.request.use((config) => {
  return config;
});
service.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.code === 200) {
      return data;
    } else {
      failure(data.message);
      return Promise.reject(data);
    }
  },
  (err) => {
    console.log(err.response?.data?.detail);
    if (err.response?.data?.detail) {
      toast.push(err.response.data.detail);
    } else {
      toast.push('Network Error');
    }
    if (err.code === 'ERR_CANCELED') return;

    return Promise.reject(err.response);
  },
);
const request = {
  get(url: any, data: any, config = {}) {
    return request.request('GET', url, { params: data }, config);
  },
  post(url: any, data: any, config = {}) {
    return request.request('POST', url, { data }, config);
  },

  request(method = 'GET', url: any, data: any, config: any) {
    const options = Object.assign({}, config);
    return new Promise((resolve, reject) => {
      service({ method, url, ...data, requestOptions: options })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        })
        .finally(() => {});
    });
  },
};

export default request;
