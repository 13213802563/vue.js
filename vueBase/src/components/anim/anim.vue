<template>
   <div>
   	 <button @click='showHide'>过渡</button>
   	 <transition name='fade'>
   	 	<p v-show="show">哈哈</p>
   	 </transition>
   	 
   	 <button @click="showHideAnim">动画</div>
   	 <transition name='hello'>
   	 	<p v-show='showAnim'>嘿嘿</p>
   	 </transition>
   	 
   	 	<button @click="animLibs">动画库</button>
		<transition name="world" enter-active-class="animated flip"
    leave-active-class="animated flip">
			<p v-show="libs">呵呵</p>
		</transition>
		
	   <svg viewBox="0 0 120 120" version="1.1"
		  xmlns="http://www.w3.org/2000/svg">
		  <circle cx="60" cy="60" r="50"/>
		</svg>
   </div>
</template>

<script>
	export default{
		name:"anim",
		data(){
			return{
				show:true,
				showAnim:true,
				libs:true
			}
		},
		methods:{
			showHide(){
				this.show=!this.show;
			},
			showHideAnim(){
				this.showAnim=!this.showAnim;
			},
			animLibs(){
				this.libs=!this.libs;
			}
		}
	}
</script>

<style>
	/*.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
*/

/*从0~1过程*/
.fade-enter-active,.fade-leave-active{
	transition: all .5s
}

.fade-enter, .fade-leave-to{
	/*opacity: 0;*/
	transform: translate(100px,0);
}

.fade-enter-to, .fade-leave {
	/*opacity: 1;*/
	transform: translate(0px,0);
}
.hello-enter-active{
	animation:bounce-in 1s ease;
}

.hello-leave-active{
	animation:bounce-in 1s ease reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}

p{
	font-size: 40px;
}
</style>