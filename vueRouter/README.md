1.安装
	npm install --save vue-router
2.引用
	import router from "vue-router"
	Vue.use(router)
3.配置路由文件
	var router = new VueRouter({
		routes: [{
			path: "/",
			component: HelloWorld
		}]
	})
	new Vue({
		el: '#app',
		template: '<App/>',
		router,
		components: {
			App
		}
	})
4.视图加载的位置
	<router-view></router-view>

5.跳转（导航）
	<router-link to="/">helloworld</router-link>
