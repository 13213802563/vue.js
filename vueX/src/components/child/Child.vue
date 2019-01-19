<template>
	<div>
		儿子-----
		{{title}}
	   <button @click='sendMsg'>按钮</button>
	</div>
</template>

<script>
	export default{
		name:'child',
		data(){
			return{
				
			}
		},
		props:{
			title:{
				type:String,
				default:''
			}
		},
		methods:{
//			sendMsg(){
//				this.$emit()
//			}
		}
	}
</script>

<style scoped>
</style>