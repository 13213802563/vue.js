<template>
<!--@mouseenter="showCarHandle"鼠标进入展示购物车，@mouseleave="hideCarHandle"鼠标移出隐藏购物车-->
  <li @mouseenter="showCarHandle" @mouseleave="hideCarHandle">
  <!--	class="ball-rect"设置小球的样式-->
  	<a href="javascript:;" class="ball-rect">购物车</a>
		<!--根据class改变颜色-->
		<span class="cart-empty-num" :class="{'cart-num':count>0}">
			<i>{{count}}</i>
		</span>
		<!--当carShow为真时显示-->
		<div class="nav-cart-wrapper" v-show="carShow">
			<div class="nav-cart-list">
				<!--购物车空否用v-if    v-else选择性展示-->
				<!--//购物车为空部分-->
				<div class="empty" v-if="count<=0">
		    	<h3>购物车为空</h3>
					<p>您还没有选购任何商品，现在前往商城选购吧!</p>
				</div>
			<!--有商品部分-->
				<div v-else class="full">
					<div class="nav-cart-items">
						<ul>
							<!--li循环添加      carGoodsData为存放加入的数组-->
							<li class="clear" v-for="item,index in carGoodsData">
								<!--单个加入信息模块-->
								<div class="cart-item js-cart-item cart-item-sell">
									<div class="cart-item-inner">
										<!--左侧手机图片-->
										<div class="item-thumb">
											<img :src="item.ali_image+'?x-oss-process=image/resize,w_80/quality,Q_100/format,webp'">
										</div>
										<!--右侧信息详情-->
										<div class="item-desc">
											<div class="cart-cell">
												<!--名字-->
												<h4> 
													<a href="/item">{{item.title}}</a>
												</h4>
												<!--颜色-->
												<p class="attrs">
													<span>{{item.spec_json.show_name}}</span>
												</p>
												<!--价格-->
												<h6>
													<span class="price-icon">¥</span><span class="price-num">{{item.price}}</span><span class="item-num">x {{item.count}}</span>
												</h6>
											</div>
										</div>
										<!--最右侧删除图标   点击执行delCarPanelHandle（）这个方法-->
										<div @click="delCarPanelHandle(item.sku_id)" class="del-btn">删除</div>
									</div>
								</div>
							</li>
						</ul>
					</div>
				 <!--信息的合计模块-->
					<div class="nav-cart-total">
						<p>共 <strong class="ng-binding">{{count}}</strong> 件商品</p>
						<h5>合计：<span class="price-icon">¥</span><span class="price-num">{{totle}}</span></h5>
						<h6>
							<router-link to="/cart" class="nav-cart-btn">去购物车</router-link>
						</h6>
					</div>
					
				</div>
			</div>
		</div>
		<!--小球飞入的特效  transition-->
		<transition
		  name="ball"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:after-enter="afterEnter"
      v-bind:css="true"
    >
      <!--//控制小球的横向移动（v-show="ball.show"当ball.show=true时显示）-->
		  <div class="addcart-mask" v-show="ball.show">
		  <!--	//控制小球的纵向移动-->
		  	<img class="mask-item"></img>
		  </div>
	  </transition>
  </li>
</template>
<script>
	export default {
	  data () {
	    return {
//	    	购物车移出演示效果
	      iTimer: null
	    }
	  },
	  watch: {
	    ["ball.show"] () {
	      if(this.ball.show){
	        
	      }
	    }
	  },
	  //计算属性
		computed: {
			//得到加入的数组
			carGoodsData () {
				return this.$store.state.carPanelData
			},
			//父页面得到store中的数量
		  count () {
		    return this.$store.getters.totleCount
		  },
		  	//父页面得到store中的总价
		  totle () {
		    return this.$store.getters.totlePrice
		  },
		  //最大限制
		  maxCount () {
		    return this.$store.state.maxOff
		  },
		 
		  carShow () {
		    return this.$store.state.carShow
		  },
//		   拿到store仓库中的ball值
		  ball () {
		    return this.$store.state.ball
		  }
		},
		methods: {
			//删除购物车数据，执行store中的delCarPanelData
		  delCarPanelHandle (id) {
        this.$store.commit('delCarPanelData',id)
		  },
		  //展示购物车(每次都先清空购物车)
		  showCarHandle () {
		    clearTimeout(this.iTimer)
		    this.$store.commit('showCar')
		  },
		  //隐藏购物车（定时器0.5秒）
      hideCarHandle () {
        this.iTimer = setTimeout(()=>{
          this.$store.commit('hideCar')
        },500)
      },
      //小球进入之前，
      beforeEnter (el) {
      	//获得按钮的所有位置
        let rect = this.ball.el.getBoundingClientRect()
        //获得购物车的位置
        let rectEl = document.getElementsByClassName('ball-rect')[0].getBoundingClientRect()
        //拿到小球
        let ball = document.getElementsByClassName('mask-item')[0]
        //按钮和购物车之间的差值 （中心点加左侧的距离）var rectWidth = rectObject.right - rectObject.left;
        let x = (rectEl.left + 16) - (rect.left + rect.width/2)
        let y = rect.top + rect.height/2 - rectEl.top + 5 - 16
        
        console.log(rect.top + rect.height/2)
        //设置移动
        el.style.transform = 'translate3d(0,'+y+'px,0)'
        //-  向左走
        ball.style.transform = 'translate3d(-'+x+'px,0,0)'
        ball.src = this.ball.img
        console.log(this.ball.img)
      },
      //小球进入
      enter (el) {
      	//获取高度
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.transform = 'translate3d(0,0,0)'
          document.getElementsByClassName('mask-item')[0].style.transform = 'translate3d(0,0,0)'
        })
      },
      //小球进入之后
      afterEnter (el) {
        this.ball.show = false
      }
		}
	}
</script>

<style type="text/css">
   /*贝塞尔曲线显示小球的飞入效果*/
	.ball-enter-active{
    transition: .5s cubic-bezier(.15,.69,.6,1.29);
  }
  .ball-enter-active .mask-item{
    transition: .5s cubic-bezier(0,0,1,1);
  }
</style>
