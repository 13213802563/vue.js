<template>
	<div>
		父亲:
		{{info}}
	<Child :title='msg' @info='handlerMsg'/>
	</div>
</template>

<script>
	import Child from './Child'
	export default{
		name:'parent',
		data(){
			return{
				 msg:'儿子，父亲给你传递数据里',
				 info:''
			}
		},
		components:{
			Child
		},
		methods:{
			handlerMsg(data){
				this.info=data;
			}
		}
	}
</script>

<style scoped>
</style>
