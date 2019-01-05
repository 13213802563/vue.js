<template>
	<div class="hello">
       post
	</div>
</template>
///post请求：(只支持form-data格式)
     form-data:?name=user&password=123
     x-www-form-urlencoded:{name:'user',password:123}
     

import qs from 'qs';///querystring 模块用于解析与格式化 URL 的查询字符串querystring
<script>
	export default {
		name: 'post',
		data() {
			return {
			}
		},
		created() {
			this.$axios("http://www.wwtliu.com/sxtstu/news/juhenews.php",qs.stringify({
				user_id:'iwen@qq.com',
				password:'iwen123'
			})

				)
				.then(res => {
					console.log(res.data);
				})
				.catch(error => {
					console.log(error);
				})
		}
	
	}
</script>

<style scoped>

</style>


////网址：qs:http://nodejs.cn/api/querystring.html
       axios:https://www.kancloud.cn/yunye/axios/234845