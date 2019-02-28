<template>
	<div class="detail-wrap">
		<div class="detail-left">
			<div class="product-board">
				<img :src="getUrl" alt="">
				<ul>
					<!--相当于li标签，故需要tag="li"-->
					<!--active-class="active" 点击高亮-->
					<!--:key="index"  严谨来些  作为-->
					<router-link active-class="active" :to="{path:'/details/'+nav.tag}" :key="index" tag="li" v-for="(nav,index) in detailsNav">{{ nav.title }}</router-link>
				</ul>
			</div>
		</div>
		<div class="detail-right">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
	
export default {
	name:"details",
	data(){
		return{
			detailsNav:[
				{
					title:"开放产品",
					tag:"earth"
				},
				{
					title:"品牌营销",
					tag:"loud"
				},
				{
					title:"使命必达",
					tag:"car"
				},
				{
					title:"勇攀高峰",
					tag:"hill"
				}
			],
      imgUrl:{
        "/details/earth":require("../assets/images/3.png"),
        "/details/loud":require("../assets/images/2.png"),
        "/details/car":require("../assets/images/1.png"),
        "/details/hill":require("../assets/images/4.png")
      }
		}
	},
  computed:{//计算属性
    getUrl(){
      return this.imgUrl[this.$route.path];
    }
  }	
}

</script>
<style>

.detail-wrap {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  padding-top: 20px;
}
.detail-left {
  float: left;
  width: 200px;
  text-align: center;
}
.detail-right {
  float: left;
  width: 980px;
  margin-left: 20px;
}
.product-board {
  background: #fff;
  padding: 20px 0;
}
.product-board ul {
  margin-top: 20px;
}
.product-board li {
  text-align: left;
  padding: 10px 15px;
  cursor: pointer;
}
.product-board li.active,
.product-board li:hover {
  background: #4fc08d;
  color: #fff;
}
.product-board li a {
  display: block;
}
.sales-board {
  background: #fff;
}
.sales-board-form {

}
.sales-board-intro h2 {font-size: 20px;
  padding: 20px;
}
.sales-board-intro p {
  background: #f7fcff;
  padding: 10px 20px;
  color: #999;
  line-height: 1.8;
}
.sales-board-form {
  padding: 30px 20px;
  font-size: 14px;
}
.sales-board-line {
  clear: both;
  padding-bottom: 20px;
}
.sales-board-line-left {
    display: inline-block;
    width: 100px;
}
.sales-board-line-right {
    display: inline-block;
    width: 75%;
}
.sales-board-des {
  border-top: 20px solid #f0f2f5;
  padding: 15px 20px;
}
.sales-board-des p {
  line-height: 1.6;
}
.sales-board-des h2 {
  font-size: 20px;
  padding-bottom: 15px;
}
.sales-board-des h3 {
  font-size: 18px;
  font-weight: bold;
  padding: 20px 0 10px 0;
}
.sales-board-des li {
  padding: 5px 0;
}
.sales-board-table {
  width: 100%;
  margin-top: 20px;
}
.sales-board-table th {
  background: #4fc08d;
  color: #fff;
}
.sales-board-table td {
    border: 1px solid #f0f2f5;
    padding: 15px;
}
	
</style>
