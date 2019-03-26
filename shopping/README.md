1.自己模拟的数据：export default itemsData   这样可以抛给外部去用
  需要用的组件：import itemsData from '@/lib/newItemsData.js'
               export default {
                  data () {
                    return {
                      itemsList: itemsData,
                    }
                  }
                 }这是就可以用里里面的数据动态渲染了
2.vue中mode: 'history'   //	去掉路由地址的#
具体介绍：https://www.cnblogs.com/minigrasshopper/p/8010867.html
3.<router-link :to="{name: 'Item', query: {itemId:item.sku_info[itemIndex].sku_id}}">查看详情</router-link>
   (1)跳转页面，传递参数，通过query里实现的，父页面通过data(){return{itemId:this.$route.query.itemId}}
      computed: {
        //数据库中数据和也main传过来的数据进行对比，相同执行对应渲染
        itemsInfo () {
          let itemsInfo = this.itemsList.filter((item) => {
            return item.sku_id == this.$route.query.itemId
          })[0]
          return itemsInfo
         }
    }
   (2)路由name属性:1. 可以在声明路由路径时，给路由起名字;2. 在main.js当中，附加name:"homeLink"。
                  3. 在Header.vue导航栏的组件中，跳转标签router-link中的to属性，改为属性绑定形式:to="{name:'homeLink'}"，即可正常实现跳转。
     参考介绍：https://www.jianshu.com/p/a0143f46c575||https://www.gyzgl.com/jsnews/325.html||https://www.cnblogs.com/ccplus/p/8535987.html
 4.:data-index="index"  data-index动态获取索引值
 5.:class="{'active':index==itemIndex}  条件成立时active
   :class="{'cur':color.id==$query.itemId}"   选中那个  那个显示
 6.总结：1.store中 state的值，getters中的值，在父亲页面都是在computed中return获取到值，在页面中进行相应的处理，像v-show="carShow"。
	      2.store中 mutations中的方法，在父页面中都是在methods中通过this.$store.commit(方法名，所需参数)，@mouseleave="hideCarHandle"

7.//相同未到最大，小球飞入
 //得到点击的按钮，event.path一级级向上查找
  state.ball.el = event.path[0]
 // 小球显示
  state.ball.show = true
  //图片地址
  state.ball.img = data[0].ali_image//相同未到最大，小球飞入
  8.Vue.set(goodsData,'count',data[1])
    Vue.set(goodsData,'checked',true)
  9.<!--全选   :class="{'checkbox-on':allChecked}获得computed中getter中计算的值-
      allChecked (state) {
	      let allChecked = true
	      state.carPanelData.forEach((goods) => {
		if(!goods.checked){
		  allChecked = false
		  return
		}
      })
      return allChecked
    },
