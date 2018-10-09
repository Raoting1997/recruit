import axios from 'axios';
import qs from 'qs';
import { baseUrl } from './env';
import { isLogin } from '@/utils/auth';

// 请求时带上cookie
axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // console.log(response);
    if (response.data.status == 401) {
        if (response.config.url.indexOf('/manager') != -1) {
            window.location = '/manager/login';
        } else {
            window.location = '/login';
        }
        return;
    }
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // console.log(error);
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // console.log(config);
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export default async(url = '', data = {}, type = 'GET') => {
    if (type == 'POST') {
        return axios({
            url: url,
            data: qs.stringify(data),
            method: type,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } else {
        return axios({
            url: url,
            params: data,
            method: type,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
}