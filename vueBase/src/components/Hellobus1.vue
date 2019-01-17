<template>
<div>
  <ul v-for="data in goodsList">
  	{{data.index}}
  <p>商品数量 ：<span v-html="data.num"></span></p>
  <p>商品库存 ：<span v-html="data.realStock"></span></p>
  <p class="quantity-selector clearfix">
  	{{data.num}}
    <span class="reduce" v-on:click="numChange(8, -1)" v-bind:class="{ 'disable' : data.num==1 }">－</span>
    <input type="number"  class="number" v-bind:data-realStock="data.realStock" v-on:keyUp="numEntry($index)" v-on:keyDown="numEntry($index)" v-model="data.num"/>
    <span class="add" v-on:click="numChange(8, 1)" v-bind:class="{ 'disable' : data.num==data.realStock }">＋</span>
   </p>
 </ul>
</div>
</template>

<script>
  export default {
	name: 'Hellobus1',
	data() {
		return {
			goodsList: [
			    {
			    	index:0,
					name: '山本汉方1',
					price: '19.00',
					realStock: 10,
					num: 1
				},
				{
					index:1,
					name: '山本汉方1',
					price: '19.00',
					realStock: 7,
					num: 8
				},
				{
					index:2,
					name: '山本汉方1',
					price: '19.00',
					realStock: 2,
					num: 2
				},
			]
		}
	},
	ready: function() {},
	methods: {
		numChange: function(index, numChange) {
			console.log("编号")
			var goods = this.goodsList[index];
			console.log(goods);
			if(numChange == 1) {
				goods.num++;
			} else if(numChange == -1) {
				goods.num--;
			}

			if(goods.num <= 1) {
				goods.num = 1;
			}

			if(goods.num >= goods.realStock) {
				goods.num = goods.realStock;
			}
		},
		numEntry: function(index) {
			console.log(index)
			var goods = this.goodsList[index];
			if(goods.num <= 1) {
				goods.num = 1;
			}

			if(goods.num > goods.realStock) {
				goods.num = goods.realStock;
			}
		}
	}
}
</script>
<style scoped>
	*{
	  padding:0;
	  margin: 0;
	  box-sizing: border-box;
	  font-size: 16px;
	}
 .clearfix:after  {
	  content: ".";
	  visibility: hidden;
	  display: block;
	  height: .1px;
	  font-size: .1em;
	  line-height: 0;
	  clear: both;
	}
	.quantity-selector {
	  margin-bottom: 20px;
	  width: 8.571rem;
	  line-height: 2.857rem;
	  border: 1px solid #d1d6e4;
	  border-radius: 3px;
	  margin: 1rem;
     display: inline-block;
	}
	.quantity-selector .reduce, 
	.quantity-selector .add {
	  float: left;
	  width: 33.33%;
	  border-right: 1px solid #d1d6e4;
	  text-align: center;
	  cursor: pointer;
	}
	.quantity-selector .number {
	  float: left;
	  width: 33.33%;
	  height: 2.857rem;
	  padding: .5rem 0;
	  line-height: 1rem;
	  border: none;
	  text-align: center;
	}
	.quantity-selector .add {
	  border-left: 1px solid #d1d6e4;
	  border-right: none;
	}
	.quantity-selector .disable {
	  color: #d2d2d2;
	  cursor: default;
	}
</style>