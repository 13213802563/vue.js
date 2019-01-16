<template>
	<div>
		<swiper :options="swiperOption">
		    <!-- slides -->
		    <swiper-slide>
		    	<img src="http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner1.jpg" alt="">
		    </swiper-slide>
		    <swiper-slide>
		    	<img src="http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner2.jpg" alt="">
		    </swiper-slide>
		    <swiper-slide>
		    	<img src="http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner3.jpg" alt="">
		    </swiper-slide>
		    <div class="swiper-pagination"  slot="pagination"></div>
		</swiper>

	</div>
</template>
<script>
	
export default{
	name:"swipers",
	data(){
		return{
			swiperOption: {
				autoplay:true,
				pagination: {
				    el: '.swiper-pagination'
				}
	        }
		}
	}
}	

</script>
<style scoped>
	

img{
	width: 500px;
	height: 350px;
}

</style>