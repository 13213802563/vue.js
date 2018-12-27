<template>
   <div>
    	 父组件
    	 <child>
     	  <div slot='s1'>
    	 	<!--<p class="ptest">我是插槽</p>   //会插入到子组件中slot中-->
    	 	<p slot="s1" class="ptest">我是插槽1</p>
    	 	<p slot="s2" class="ptest">我是插槽2</p>
    	 	</div>
             <template slot='s2' slot-scope='key'>////slot-scope
             	<p class="ptest">
             		{{key.text}}
             	</p>
             </template>
    	 </child>
   </div> 
</template>

<script>
	import child from "./child"
	
	export default{
		name:'parent',
		data(){
			return{
			}
	},
	components:{
		child
	}
}
</script>

<style>
</style>