import axios from 'axios'

const connection = axios.create({
    baseURL: '',
    timeout: 10000
})
// 请求拦截器
connection.interceptors.request.use(function (config) {
    config.headers['platform'] = 'sharePlatform-weixin';
    config.headers['jzpt-token'] = localStorage.getItem('token')? localStorage.getItem('token'):'';
    console.log('正在发送请求...');
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 响应拦截器
connection.interceptors.response.use(function (response) {
    // TODO 根据返回值判断是否跳转到登录页
    console.log('请求成功...');
    return response;
}, function (error) {
    return Promise.reject(error);
});


export default connection;
