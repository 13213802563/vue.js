<template>
	<div id="com">
		{{message.split('').reverse().join('')}}
		{{msgRe}}
		<input type="text" v-model.lazy="msg">
		<p>{{msg}}</p>
	</div>
</template>

<script>
export default {
		el:'#com',
		data(){
          return{
           	message:'hello',
           	msg:'guojun'
     	 }
       },
       watch:{
       		msg:function(data){
//				console.log(data);
             setTimeout(()=>{

             	this.Message=data;
             },1000)
			}
       },
		computed:{
			msgRe(){
				return this.message.split('').reverse().join('');
			}
		}
	}
</script>

<style>
</style>