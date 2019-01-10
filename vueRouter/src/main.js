// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import VueRouter from 'vue-router'
//import HelloWorld from './components/HelloWorld'
//import HelloIwen from './components/HelloIwen'

//Vue.use(VueRouter)
//
//var router= new  VueRouter({
//	routes:[
//	  {
//	  	path:'/helloWorld',
//	  	component:HelloWorld  
//	  },
//	  {
//	  	path:'/HelloIwen',
//	  	component:HelloIwen
//	  } 
//	 ]
//});
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  router,
  template: '<App/>'
})
