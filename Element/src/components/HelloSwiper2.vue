<template>
	<swiper :options="swiperOption">
    	<swiper-slide v-for="(banner,index) in banners" :key="index">
    		<img :src="banner.img" alt="">
    	</swiper-slide>
    	<div class="swiper-pagination" slot="pagination"></div>
  	</swiper>
</template>
<script>
	
export default{
	name:"swipers",
	data(){
		return{
			banners:[],
			swiperOption: {
				autoplay:true,
				pagination: {
				    el: '.swiper-pagination'
				},
				on:{
					slideChangeTransitionStart(){
						console.log(this.activeIndex)
					},
					touchStart(event){
						console.log("出发了")
					}
				}
	        }
		}
	},
	created(){
		this.$axios.get("http://www.wwtliu.com/sxtstu/blueberrypai/getIndexBanner.php")
		.then(res => {
			this.banners = res.data.banner;
		})
		.catch(error => {
			console.log(error);
		})
	}
}	

</script>
<style scoped>
	

img{
	width: 500px;
	height: 350px;
}

</style>