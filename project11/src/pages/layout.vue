<template>
	<div class="index-wrap">
		<div class="index-left">
			<div class="index-left-block">
				<h2>全部产品</h2>	
				<template v-for="(product,index) in productList">
					<h3>{{ product.category }}</h3>
					<ul>
						<li v-for="item in product.list">
							<a target="_blank" :href="item.url">{{ item.name }}</a>
							<span v-if="item.hot" class="hot-tag">HOT</span>
						</li>
					</ul>
					<div v-if="index%2 == 0" class="hr"></div>
				</template>
			</div>
			<div class="index-left-block lastest-news">
				<h2>最新消息</h2>
				<ul>
					<li v-for="item in news">
						<a target="_blank" :href="item.url">{{ item.author_name }}</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="index-right">
			<div class="swiper-size">
				<swiper :options="swiperOption">
				    <swiper-slide>
				    	<a target="_blank" href="http://www.wwtliu.com/blog">
				    		<img class="swiperimg" :src="swiperData[0]" alt="">
				    	</a>
				    </swiper-slide>
				    <swiper-slide>
				    	<img class="swiperimg" :src="swiperData[1]" alt="">
				    </swiper-slide>
				    <swiper-slide>
				    	<img class="swiperimg" :src="swiperData[2]" alt="">
				    </swiper-slide>
				    <swiper-slide>
				    	<img class="swiperimg" :src="swiperData[3]" alt="">
				    </swiper-slide>
				    <div class="swiper-pagination"  slot="pagination"></div>
				    <div class="swiper-button-prev" slot="button-prev"></div>
				    <div class="swiper-button-next" slot="button-next"></div>
				</swiper>
			</div>
			<div class="index-board-list">
				<div class="index-board-item" v-for="(borad,index) in boradList" :class="['index-board-'+ borad.tag ,{'line-last' : index%2 !==0}]">
					<div class="index-board-item-inner">
						<h2>{{ borad.title }}</h2>
						<p>{{ borad.desc }}</p>
						<div class="index-board-button">
							<router-link :to="{path:'/details/'+borad.tag}" class="button">立即购买</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>	
export default{
	name:"layout",
	data(){
		return{
			swiperData:[
				require("../assets/slideShow/j1.jpg"),
				require("../assets/slideShow/j2.jpg"),
				require("../assets/slideShow/j3.jpg"),
				require("../assets/slideShow/j4.jpg")
			],
			swiperOption: {
	          	pagination: {
				    el: '.swiper-pagination',
				},
				loop:true,
				navigation: {
				    nextEl: '.swiper-button-next',
				    prevEl: '.swiper-button-prev',
				}
	        },
	        boradList:[
	        	{
	        		title:"开放产品",
	        		desc:"开放产品是一款开放产品",
	        		tag:"earth"
	        	},
	        	{
	        		title:"品牌营销",
	        		desc:"品牌营销帮助你的产品更好地找到定位",
	        		tag:"loud"
	        	},
	        	{
	        		title:"使命必达",
	        		desc:"使命必达快速迭代永远保持最前端的速度",
	        		tag:"car"
	        	},
	        	{
	        		title:"勇攀高峰",
	        		desc:"帮你勇闯高峰，到达事业的顶峰",
	        		tag:"hill"
	        	}
	        ],
			news:[],
			productList:[
				{
					category:"手机应用类",
					list:[
						{
							name:"91助手",
							url:"http://www.wwtliu.com/blog",
							hot:false
						},
						{
							name:"豌豆荚",
							url:"http://www.wwtliu.com/blog",
							hot:true
						},
						{
							name:"金山毒霸",
							url:"http://www.wwtliu.com/blog",
							hot:false
						}
					]
				},
				{
					category:"开发工具",
					list:[
						{
							name:"WebStorm",
							url:"http://www.wwtliu.com/blog",
							hot:false
						},
						{
							name:"HBuiler",
							url:"http://www.wwtliu.com/blog",
							hot:true
						},
						{
							name:"Sublime Text 3",
							url:"http://www.wwtliu.com/blog",
							hot:false
						},
						{
							name:"Atom",
							url:"http://www.wwtliu.com/blog",
							hot:true
						}
					]
				}
			]
		}
	},
	created(){
		this.$axios.get("http://www.wwtliu.com/sxtstu/news/juhenews.php",{
			params:{
				count:10,
				type:"top"
			}
		})
		.then(res => {
			this.news = res.data;
		})
		.catch(error => {
			console.log(error)
		})
	}
}	

</script>
<style scoped>
.index-wrap {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}
.index-left {
  float: left;
  width: 300px;
  text-align: left;
}
.index-right {
  float: left;
  width: 900px;
}
.index-left-block {
  margin: 15px;
  background: #fff;
  box-shadow: 0 0 1px #ddd;
  height: 350px;
}
.index-left-block .hr {
  margin-bottom: 20px;
  height: 1px;
  width: 100%;
  background: #ddd;
}
.index-left-block h2 {
  background: #4fc08d;
  color: #fff;
  padding: 10px 15px;
  margin-bottom: 20px;
}
.index-left-block h3 {
  padding: 0 15px 5px 15px;
  font-weight: bold;
  color: #222;
}
.index-left-block ul {
  padding: 10px 15px;
}
.index-left-block li {
  padding: 5px;
}
.index-board-list {
  overflow: hidden;
  margin-top: 15px;
}
.index-board-item {
  float: left;
  width: 400px;
  background: #fff;
  box-shadow: 0 0 1px #ddd;
  padding: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.index-board-item-inner {
  min-height: 125px;
  padding-left: 120px;
}
.index-board-car .index-board-item-inner{
  background: url(../assets/images/1.png) no-repeat;
}
.index-board-loud .index-board-item-inner{
  background: url(../assets/images/2.png) no-repeat;
}
.index-board-earth .index-board-item-inner{
  background: url(../assets/images/3.png) no-repeat;
}
.index-board-hill .index-board-item-inner{
  background: url(../assets/images/4.png) no-repeat;
}
.index-board-item h2 {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}
.line-last {
  margin-right: 0;
}
.index-board-button {
  margin-top: 20px;
}
.lastest-news {
  min-height: 350px;
}
.hot-tag {
  background: red;
  color: #fff;
}
.new-item {
  display: inline-block;
  width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.swiperimg{
	width: 100%;
}

.swiper-size{
	margin-top: 15px;
}

.button{
	background: #4fc08d;
	color: #fff;
    display: inline-block;
    padding: 10px 20px;
    cursor: pointer;
}

</style>
