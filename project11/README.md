1.路由npm安装：npm  install vue-Router
axios请求的安装：npm install axios

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

4.子父级之间的通信
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
    父亲：<child :msg="message"></child>/////将父页面数据源msg传给子页面的message
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
            
    

