import qs from 'qs'
import axios from 'axios'

// 请求拦截器
axios.interceptors.request.use(function (config) {
    // config.headers['platform'] = 'sharePlatform-weixin';
    // config.headers['jzpt-token'] = localStorage.getItem('token')? localStorage.getItem('token'):'';
    //console.log('正在发送请求...');
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function (response) {
    // TODO 根据返回值判断是否跳转到登录页
    //console.log('请求成功...');
    return response;
}, function (error) {
    return Promise.reject(error);
});


const ajax = {
    post: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(data,{arrayFormat: 'repeat'}),{
                headers:{
                    'platform':'sharePlatform-weixin',
                    'jzpt-token':localStorage.getItem('token')? localStorage.getItem('token'):''
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    }, 
    postwc: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, data,{
                headers:{
                    'platform':'sharePlatform-weixin',
                    'jzpt-token':localStorage.getItem('token')? localStorage.getItem('token'):'',
                    'Content-Type':'application/json'
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    },
    get: function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {params: qs.stringify(data)}).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    },
    postNoToken:function (url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(data,{arrayFormat: 'repeat'}),{
                headers:{
                    'platform':'sharePlatform-weixin',
                    'jzpt-token':''
                }
            }).then(function (res) {
                resolve(res.data)
            }).catch(function (err) {
                reject(err)
            })
        })
    }

};
export default ajax;
