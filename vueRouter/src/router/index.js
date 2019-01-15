import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import HelloIwen from '@/components/HelloIwen'
import Index from '@/components/index'
import Course from '@/components/course'
import Master from '@/components/master'
import Java from "@/components/pages/java"
import Web from "@/components/pages/web"

Vue.use(VueRouter)

// export default new  VueRouter({
// 	routes:[
// 	  {
// 	  	path:'/helloWorld',
// 	  	component:HelloWorld  
// 	  },
// 	  {
// 	  	path:'/HelloIwen',
// 	  	component:HelloIwen
// 	  } 
// 	 ]
// });
export default new Router({
	//history.back()
	mode: "history",
	linkActiveClass: "active",
	routes: [{
		path: '/',
		name: 'index',
		component: Index
	}, {
		path: '/course',
		name: 'course',
		component: Course,
		// 默认进来重定向到java页面
		redirect: "/course/java",
		children: [{
			path: "java",
			name: "java",
			component: Java
		}, {
			path: "web",
			name: "web",
			component: Web
		}]
	}, {
		path: '/master/:count',
		name: 'master',
		component: Master
	}]
})
