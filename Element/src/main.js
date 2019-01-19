// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Axios from "axios"
import VueLazyload from 'vue-lazyload'


import 'swiper/dist/css/swiper.css'

import {
	Button, 
	Select,
	Carousel,
  CarouselItem,
} from 'element-ui';

Vue.config.productionTip = false

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(VueAwesomeSwiper);
Vue.use(VueLazyload)
//Vue.use(VueLazyload, {
//preLoad: 1.3,
//error: '../assets/error.jpg',
//loading: '../assets/loadding.jpg',
//attempt: 1,
//// the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
//listenEvents: [ 'scroll' ]
//})

Vue.prototype.$axios = Axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
