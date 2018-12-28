<template>
  <div>
    {{msg}}
    <button @click="changeinfo">changeinfo</button>
  </div>
</template>

<script>
	export default{
		name:'small2',
		data(){
			return{
				msg:'small2'
			}
		},
		methods:{
			changeinfo(){
				this.msg='small11111';
			}
		}
	}
</script>

<style scoped>
	
</style>