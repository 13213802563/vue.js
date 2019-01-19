<template>
	<div>
	     <img v-lazy="imgUrl"/>
		<img v-lazy="imgObj" />
	</div>
</template>

<script>
	export default{
		data(){
			return{
				// 引入图片，如果是在js中。必须require进来
			imgObj: {
		        src: "http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner1.jpg",
		        error: require("../assets/error.jpg"),
		        loading: require("../assets/loadding.jpg")
		    },
		    imgUrl:"http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner2.jpg"  
			}
		}
	}
</script>

<style>
</style>