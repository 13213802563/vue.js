
import Vue from 'vue'
import App from './App'
import Axios from 'axios'
import qs from 'qs'

Vue.prototype.$axios = Axios
//跨域适配
Vue.prototype.HOST = '/api'
//全局配置
// Axios.defaults.baseURL = 'http://www.wwtliu.com';
// Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

Vue.config.productionTip = false

//添加请求拦截器
Axios.interceptors.request.use(function(config){
	  if(config.method=='post'){
	  	config.data=qs.stringify(config.data);
	  }
	  return config;
},function(error){
	 return Promise.reject(error);
});
//添加响应拦截器
Axios.interceptors.response.use(function(response){
	return response;
},function(error){
	return Promise.reject(error);
});


new Vue({
	el: '#app',
	components: {
		App
	},
	template: '<App/>'
})
