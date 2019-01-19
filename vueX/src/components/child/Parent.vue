<template>
	<div>
		父亲
	<Child :title='msg'/>
	</div>
</template>

<script>
	import Child from './Child'
	export default{
		name:'parent',
		data(){
			return{
				 msg:'儿子，父亲给你传递数据里'
			}
		},
		components:{
			Child
		}
	}
</script>

<style scoped>
</style>