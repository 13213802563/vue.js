import Vue from 'vue'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import Vant from 'vant';
import 'vant/lib/index.css';
import './assets/scss/global.scss'
import ajax from './api/index.js'
import ajax2 from './api/file.js'
import App from './App.vue'
import router from './router'
import store from './store'
let env = process.env.NODE_ENV
Vue.config.productionTip = false
Vue.config.devtools = true

function gotoURL(callback){
  window.onpopstate = null;
  window.onpopstate = function(){
    callback()
  }
}

Vue.prototype.gotoURL = gotoURL
Vue.prototype.$post=ajax.post
Vue.prototype.$postwc=ajax.postwc
Vue.prototype.$get=ajax.get
Vue.prototype.$postNoToken = ajax.postNoToken
Vue.prototype.$file = ajax2.postFile
Vue.prototype.$env = env
Vue.use(Mint);
Vue.use(Vant);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
