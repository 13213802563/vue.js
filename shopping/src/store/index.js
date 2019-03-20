import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
state: {
	  //定义加入购物车的数组
    carPanelData: [],
    receiveInfo: [{
      'name': '王某某',
      'phone': '13811111111',
      'areaCode': '010',
      'landLine': '64627856',
      'provinceId': 110000,
      'province': '北京市',
      'cityId': 110100,
      'city': '市辖区',
      'countyId': 110106,
      'county': '海淀区',
      'add': '上地十街辉煌国际西6号楼319室',
      'default': true,
      'checked': true
    },{
      'name': '李某某',
      'phone': '13811111111',
      'areaCode': '010',
      'landLine': '64627856',
      'provinceId': 110000,
      'province': '北京市',
      'cityId': 110100,
      'city': '市辖区',
      'countyId': 110106,
      'county': '海淀区',
      'add': '上地十街辉煌国际东6号楼350室',
      'default': false,
      'checked': false
    }],
    provisionalOrder: [],
    orderData: [],
    //默认限制弹窗不打开
    maxOff: false,
    //购物车初始不打开
    carShow: false,
    //小球的信息（展示，哪个按钮，图片地址）
    ball: {
      show: false,
      el: null,
      img: ''
    }
},

getters: {
	//得到购物中的数量
    totleCount (state) {
      let count = 0
      state.carPanelData.forEach((goods) => {
        count += goods.count;
      })
	  return count
	},
	//得到购物中的价格
	totlePrice (state) {
	  let total = 0
	  state.carPanelData.forEach((goods) => {
	    total += goods.price * goods.count
	  })
      return total
    },
    checkedCount (state) {
      let count = 0
      state.carPanelData.forEach((goods) => {
        if(goods.checked)
        count += goods.count;
      })
      return count
    },
    checkedPrice (state) {
      let total = 0
      state.carPanelData.forEach((goods) => {
        if(goods.checked)
        total += goods.price * goods.count
      })
      return total
    },
    checkedCarPanelData (state) {
      let checkedCarPanelData = []
      state.carPanelData.forEach((goods) => {
        if(goods.checked)
        checkedCarPanelData.push(goods);
      })
      return checkedCarPanelData
    },
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
    //取得最大的限制值  和shop.vue中computed
    maxCount (state) {
      let maxOff = false
      state.carPanelData.forEach((goods) => {
        if(goods.count>goods.limit_num){
          goods.count--
        }
      })
      return maxOff
    }
},
mutations: {
	//加入购物车的方法   对应shop-item.vue下的methods
	addCarPanelData (state,data) {
//	  标识符  用来判断购物车中是否存在相同商品，true表示没有，false表示有商品
	  let bOff = true
	  state.carPanelData.forEach((goods) => {
	  	//当购物车中存在相同物品时，增加数量
	    if(goods.sku_id === data[0].sku_id){
	      goods.count += data[1]
      //最大值的判断和处理
	      if(goods.count>goods.limit_num){
	        goods.count -= data[1]
	        state.maxOff = true
	        bOff = false
	        return
	      }
	      //相同未到最大，小球飞入
	      //得到点击的按钮，event.path一级级向上查找
          state.ball.el = event.path[0]
//        小球显示
          state.ball.show = true
          //图片地址
          state.ball.img = data[0].ali_image
	      bOff = false
	      state.carShow = true
	    }
	  })
	  //如果购物车中不存在  直接将当前数据加入购物车，count=1
	  if(bOff){
	    let goodsData = data[0]
	    Vue.set(goodsData,'count',data[1])
	    Vue.set(goodsData,'checked',true)
	    state.carPanelData.push(goodsData)
	    //最大值的限制
	    state.carShow = true
        state.ball.el = event.path[0]
        state.ball.show = true
        state.ball.img = data[0].ali_image
	  }
	},
    plusCarPanelData (state,id) {
      state.carPanelData.forEach((goods,index) => {
        if(goods.sku_id === id){
          if(goods.count === goods.limit_num) return
          goods.count ++
          return
        }
      })
    },
	subCarPanelData (state,id) {
	  state.carPanelData.forEach((goods,index) => {
        if(goods.sku_id === id){
          if(goods.count === 1) return
          goods.count --
          return
        }
      })
	},
	//删除购物车中的列表    对应car-panel.vue中的methods
	delCarPanelData (state,id) {
	  state.carPanelData.forEach((goods,index) => {
        if(goods.sku_id === id){
          state.carPanelData.splice(index,1)
          return
        }
      })
	},
    checkGoods (state,id) {
      state.carPanelData.forEach((goods,index) => {
        if(goods.sku_id === id){
          goods.checked = !goods.checked
        }
      })
    },
    allGoodsCheck (state,checked) {
      if(checked){
        state.carPanelData.forEach((goods,index) => {
          goods.checked = false
        })
      }else{
        state.carPanelData.forEach((goods,index) => {
          goods.checked = true
        })
      }
    },
    delCheckGoods (state) {
      let i = state.carPanelData.length
      while(i--){
        if(state.carPanelData[i].checked){
          state.carPanelData.splice(i,1)
        }
      }
    },
    submitOrder (state,data) {
      let i = state.carPanelData.length
      while(i--){
        if(state.carPanelData[i].checked){
          state.carPanelData.splice(i,1)
        }
      }
      state.orderData.unshift(data)
      state.receiveInfo.forEach((receive) => {
        receive.checked = receive.default
      })
    },
    payNow (state,id) {
      state.orderData.forEach((order,index) => {
        if(order.orderId === id){
          order.isPay = true
          return
        }
      })
    },
    alertPrompt (state) {
      state.maxOff = true
    },
    //关闭达到最大时打开的弹窗   点击方法中的  对应prompt.vue中methods
    closePrompt (state) {
      state.maxOff = false
    },
    showCar (state) {
      state.carShow = true
    },
    hideCar (state) {
      state.carShow = false
    },
    checkDefault (state,data) {
      state.receiveInfo.forEach((receive,index) => {
        if (receive==data) {
          receive.default = true
//        state.receiveInfo.unshift(state.receiveInfo.splice(index,1)[0])
        } else {
          receive.default = false
        }
      })
    },
    checkOut (state,data) {
      state.provisionalOrder = data
    },
    submitReceive (state,data) {
      if(data[0].default){
        state.receiveInfo.forEach((receive,index) => {
          receive.default = false
          receive.checked = false
        })
//      state.receiveInfo.unshift(data)
//      return
      }
      if(data[1]==null){
        state.receiveInfo.push(data[0])
      }else{
        console.log(data[0])
        state.receiveInfo[data[1]] = data[0]
      }
    }
}
})

export default store
