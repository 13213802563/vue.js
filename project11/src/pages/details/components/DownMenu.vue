<template>
	<div class="selection-component">
	<!--	下拉菜单-->
		<div class="selection-show"  @click="showHide">
			<!--<span>初级版</span>--><!--//nowINdex为点击的索引-->
			<span>{{this.DownData[nowIndex].name}}</span>
			<div class="arrow"></div>
		</div>
		<!--	下拉菜单-->
		<div class="selection-list"  v-show="show">
			<ul>
				<li @click="selectList(index)"  v-for="(item,index) in DownData">{{item.name}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		name:"downmenu",
		data(){
			return{
				nowIndex:0,
				show:false,
				
			}
		},
		props:{//prop返回数组数据类型
//				DownData:{
//						type:Array,
//						default:function(){
//							return[
//							   {
//									name:"初级版",
//									value:1
//								},
//								{
//									name:"中级版",
//									value:2
//								},
//								{
//									name:"高级版",
//									value:3
//								}
//							]
//						}
//				}
			DownData:{
				type:Array,
				default:function(){
					return[
					  {
					  	name:"test",
					  	value:1
					  }
					]
				}
			}
		},
		methods:{
			selectList(index){
				this.nowIndex=index;
				this.show=false;
 				this.$emit("downmenu",this.DownData[index].value);
 				this.$store.dispatch("updateOrder",["downmenu",this.DownData[index].value])
			},
			showHide(){
				this.show=!this.show;
			}
		}
				
		
	}
</script>

<style scoped>
.selection-component {
  position: relative;
  display: inline-block;
}
.selection-show {
  border: 1px solid #e3e3e3;
  padding: 0 20px 0 10px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  height: 25px;
  line-height: 25px;
  border-radius: 3px;
  background: #fff;
}
.selection-show .arrow {
  display: inline-block;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #e3e3e3;
  width: 0;
  height: 0;
  margin-top: -1px;
  margin-left: 6px;
  margin-right: -14px;
  vertical-align: middle;
}
.selection-list {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 25px;
  width: 100%;
  background: #fff;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  z-index: 5;
}
.selection-list li {
  padding: 5px 15px 5px 10px;
  border-left: 1px solid #e3e3e3;
  border-right: 1px solid #e3e3e3;
  cursor: pointer;
  background: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
.selection-list li:hover {
  background: #e3e3e3;
}	
</style>
