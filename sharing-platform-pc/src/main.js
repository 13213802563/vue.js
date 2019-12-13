
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import ajax from './lib/ajax.js'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$post=ajax.post
Vue.prototype.$postwc = ajax.postwc
Vue.prototype.$get=ajax.get
Vue.prototype.$file=ajax.postFile
Vue.prototype.$postNoToken = ajax.postNoToken
Vue.prototype.getPageIndex = function () {
  return location.hash.replace('#','')
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


