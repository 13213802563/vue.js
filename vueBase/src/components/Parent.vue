<template>
	<div>
<!--	     父亲-->
		<Son title="传递数据"/>
		<input type="text"  v-model="lifemsg">
		<Son :title="msg"  :lifemsg="lifemsg"  :num='num' :objdata='myobj'/>
		<button @click="changeMsg">按钮</button>
	</div>
</template>
<script>
	import Son from './Son'
	
	export default{
	name:'pa',
	data(){
		return{
			msg:'我是活的数据',
			lifemsg:'hello',
			num:10,
			myobj:{
				name:'iwen',
				age:20
			}
		}
	},
	components:{
		Son
	},
	methods:{
		changeMsg(event){
			this.msg="修改后的数据";
		}
	}
}
</script>

<style scoped>
</style>