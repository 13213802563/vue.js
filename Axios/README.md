Axios
	中文：https://www.kancloud.cn/yunye/axios/234845	
	github：https://github.com/axios/axios
	1.安装
		npm install axios
	2.引入加载
		import Axios from "axios"
		Vue.prototype.$axios = Axios
	3.请求
		get请求：
			this.$axios("http://www.wwtliu.com/sxtstu/news/juhenews.php",{
		      params:{
		        type:"junshi",
		        count:30
		      }
		    })
		    .then(res => {
		      this.newsData = res.data;
		      console.log(res.data);
		    })
		    .catch(error => {
		      console.log(error);
		    })
		post请求：
			form-data:?name=iwen&age=20
			x-www-form-urlencoded:{name:"iwen",age:20}
			注意：axios接受的post请求参数的格式是form-data格式
			this.$axios.post("http://www.wwtliu.com/sxtstu/blueberrypai/login.php",	qs.stringify({
				user_id:"iwen@qq.com",
					password:"iwen123",
					verification_code:"crfvw"
				}))
				.then(res => {
					console.log(res.data)
				})
				.catch(error => {
					console.log(error);
				})
	4.全局的 axios 默认值
		axios.defaults.baseURL = 'https://api.example.com';
		axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
		axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	5.拦截器
            安装服务器   cnpm install --save-dev express mysql
	6.跨域处理：
		修改config index.js文件
			proxyTable: {
	            "/api": {
	                target: "http://localhost:3000",
	                changeOrigin: true,
	                pathRewrite: {
	                    '^/api': ''
	                }
	            }
	        }
	    添加host
	    	Vue.prototype.HOST = '/api'
	    注意：此种跨域解决方案，只能适用于测试阶段，打包的时候，不会具备服务器
	          不能跨域了，后端解决。
		
Mock：数据模拟
	1.自己创建JSON文件。使用get请求形式访问数据
		优点：方便，快捷
		缺点：只能存在get请求
	2.项目中集成服务器，模拟各种接口
		优点：模拟真实线上环境
		缺点：增加开发成本
	3.直接使用线上数据
		优点：真实
		缺点：不一定每个项目都存在
	4.数据模拟库
		http://mockjs.com/

MockJS:
	语法：
		'list|1-10': [{
			'id|+1': 1
		}]
	1.'name|1': array

		从属性值 array 中随机选取 1 个元素，作为最终值。

		2.'name|+1': array

		从属性值 array 中顺序选取 1 个元素，作为最终值。

		3.'name|min-max': array

		通过重复属性值 array 生成一个新数组，重复次数大于等于 min，小于等于 max。

		4.'name|count': array

		通过重复属性值 array 生成一个新数组，重复次数为 count。
