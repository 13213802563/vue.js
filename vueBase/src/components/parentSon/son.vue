<template>
	<div>
		子组件
	
		<button @click="sendMsg">传递</button>
	</div>
</template>

<script>
	export default{
		name:"son",
		data(){
			return{
				msg:'我是子组件数据'
			}
		},
		props:{//父传子
			num:{
				type:Number,
				default:5
			}
		},
		computed:{
			addNum(){
				return this.num*5;
			}
		},
		methods:{
			sendMsg(event){
				//参数1：key,参数2：数据
//				this.$emit('sendmsg',this.msg);
                this.$emit('sendmsg',this.addNum);//子传父
			}
		}
	}
</script>

<style>
</style>