<template>
	<div> 
	  big
	  <component :is='currentView'></component>
	  <button @click="changeView">切换组件</button> 
	</div>
</template>
import small1 from './small1'
import small2 from './small2'
<script>
	export default{
		name:'big',
		data(){
			return{
			  currentView:'small1',
			  flag:true
			}
		},
		components:{
			small1,
			small2
		},
		methods:{
			changeView(){
				if(this.flag){
					this.currentView='small1';
					this.flag=false;
				}
				else{
					this.currentView='small2';
					this.flag=true;
				}
			}
		}
		
	}
</script>

<style scoped>
</style>