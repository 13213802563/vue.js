<template>
	<div>
		<ul>
		 <li>
		    <router-link  :to='urlData.helloworld'>helloworld</router-link>
		 </li>
		  <li>
		    <router-link  :to='urlData.helloiwen'>helloiwen</router-link>
		 </li>
		</ul>
	</div>
</template>

<script>
	export default{
		name:'navList',
		data(){
			return{
				urlData:{
					helloworld:'/helloworld',
					helloiwen:'/helloiwen'
				}
			}
		}
	}
</script>

<style>
</style>