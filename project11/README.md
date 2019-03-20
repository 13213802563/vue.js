1.路由npm安装：npm  install vue-Router
axios请求的安装：npm install axios
vuex的安装：npm install vuex --save
        import Vue from 'vue'
	import Vuex from 'vuex'
	Vue.use(Vuex)
Vue-resource的安装：npm install --save vue-resource
main.js   import VueResource  from 'vue-resource'
安装所有插件：npm  install

2.vue的安装：
npm install -g vue-cli
vue init webpack project
cd project
npm run dev

3.swiper：http://github.com/surmon-china/vue-awesome-swiper
安装：npm install vue-awesome-swiper --save
引入：
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

4.普通子父级之间的通信
子传父：this.$emit("方法","信息")
   子： sendMsgToParent:function(){
       this.$emit("listenToChildEvent",msg)
    }
    <button v-on:click="sendMsgToParent">向父组件传值</button>
    父：在父组件中的子标签中监听该自定义事件并添加一个响应该事件的处理方法
       <child  v-on:listenToChildEvent="showMsgFronChild"/>
       methods:{
          showMsgFromChild:function(data){
             console.log(data);
          }
       }
 父传子：prop
    父亲：<child v-bind:msg="message"></child>/////将父页面数据源msg传给子页面的message
    子：
         //第一种
          props:['msg']   //用对应的变量名接受对应的自定义属性的值
          //第二种
           props:{
                 msg:{
                     //配置接收的数据类型、验证
                     type:[String,Number]
                     required:true,
                     default:function(){
                        return[
                          {}
                        ]
                     }
                  }
             }
     5.使用vuex进行数据的传递：
      （1）store文件夹下的index.js：
     	        import Vue from "vue"
		import VueX from "vuex"
		Vue.use(VueX)
		export default new VueX.Store({
			state:{
				order:{
					"counter":1,
					"downmenu":1,
					"radios":1
				},
			},

			mutations:{
				updateOrder(state,data){
					state.order[data[0]] = data[1];
				},
			},
			actions:{
				updateOrder(context,data){
					context.commit("updateOrder",data);
				},
			},
			getters:{
				getOrder(state){
					return state.order ? state.order : {}
				},
			}

		})
     （2）子页面：
          	methods:{
		  mins(){
		    this.$store.dispatch("updateOrder",["counter",this.number])
		  }
		}
      （3）父页面：
	 computed:{
	   getOrder(){
	      return this.$store.getters.getOrder;
	    }
	 }
	 methods: {
	  //删除购物车数据，执行store中的delCarPanelData
            delCarPanelHandle (id) {
	      this.$store.commit('delCarPanelData',id)
	    }
	 }
	 总结：1.store中 state的值，getters中的值，在父亲页面都是在computed中return获取到值，在页面中进行相应的处理，像v-show="carShow"。
	      2.store中 mutations中的方法，在父页面中都是在methods中通过this.$store.commit(方法名，所需参数)，@mouseleave="hideCarHandle"
	       
	 
        6.:class="{'active':index == nowIndex}"
          if（index == nowIndex）条件为真的时候执行active
       7.（1）:src="getUrl"   /////src绑定后面的返回值
          （2）computed:{//计算属性
                getUrl(){
                  return this.imgUrl[this.$route.path];
                }
              }
          （3）指定路径下 ，加载指定的图片
              imgUrl:{
                 "/details/earth":require("../assets/images/3.png"),
                 "/details/loud":require("../assets/images/2.png"),
                 "/details/car":require("../assets/images/1.png"),
                 "/details/hill":require("../assets/images/4.png")
               }
   8. <ul>
	<!--相当于li标签，故需要tag="li"--><!--router-link路由跳转  相当于a标签-->
	<!--active-class="active" 点击高亮--><!--:to相当于src-->
	<!--:key="index"  严谨来些  作为-->
   <router-link active-class="active" :to="{path:'/details/'+nav.tag}" :key="index" tag="li" v-for="(nav,index) in detailsNav">
      {{ nav.title }}</router-link>
				</ul>
     9.redirect:"/details/earth",//重定向，默认打开第一个选中
      10. v-bind指令用于设置HTML属性：v-bind:href  缩写为 :href
         <a :href="{{url}}">aa</a>
	 v-on 指令用于绑定HTML事件 ：v-on:click 缩写为 @click
	 <a @click="get()">aa</a>
	 
         

