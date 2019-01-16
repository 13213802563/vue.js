<template>
	<div class="hello">
		<label>
      <input type="checkbox" name="all" v-on:click="chooseAll" v-model="selectArr.length===goodsList.length" />
      <span>全选</span>
   </label>
    <ul>
			<li v-for="(item,index) in goodsList">
				<a href="javascript:;" rel="external nofollow">
					<input type="checkbox" :value="index" v-model="selectArr" /> 
					商品名称:<span v-html="item.name"></span> 
					| 价格:<span v-html="item.price"></span>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
		var goodsList= [{
				name: '山本汉方1',
				price: '19.00'
			},
			{
				name: '山本汉方2',
				price: '19.00'
			},
			{
				name: '山本汉方3',
				price: '19.00'
			},
			{
				name: '山本汉方4',
				price: '19.00'
			},
			{
				name: '山本汉方5',
				price: '19.00'
			}];
export default {
   name: 'HelloWorld',
   data() {
	 return {
		goodsList:goodsList ,
		 selectArr : []
	 }
  },
   methods : {
    chooseAll : function(event) {
      var oThis = this;
      oThis.selectArr = [];
      if (event.currentTarget.checked ) {
        oThis.goodsList.forEach(function(item , index) {
          oThis.selectArr.push(index);
        });
      }
      console.log(oThis.selectArr);
    }
  },
   ready:function(){}
 }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  padding: 0;
  margin: 0;
}
a {
  color: #333;
  text-decoration:none;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
/*  display: inline-block;*/
  margin: 0 10px;
}
</style>
