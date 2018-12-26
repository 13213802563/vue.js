<template>
   <div>
    	 父组件
     <input type='text' v-model="num">
   	 <son @sendmsg="getMsg" :num="num"/>
   	 {{info}}
   </div>
</template>

<script>
	import son from "./son"
	
	export default{
		name:'parent',
		data(){
			return{
				info:'nihao',
				num:10
			}
	},
	computed:{
		getNum(){
			return this.num-0;
		}
		
	},
	components:{
		son
	},
	methods:{
		getMsg(data){
			this.info=data;
		}
	}
}
</script>

<style>
</style>