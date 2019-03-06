<template>
	<div class="counter-component">
		<div class="counter-btn"  @click="mins">-</div>
		<div class="counter-show">
			<input type="text" v-model="number"  @keyup="inputHandler">
		</div>
		<div class="counter-btn" @click="maxs">+</div>
    </div>
</template>

<script>
	export default{
		name:"counter",
		data(){
			return{
				number:1
			}
		},
		props:{//父亲传子
			max:{
				type:Number,
				default:5
			},
			min:{
				type:Number,
				default:1
			}
		},
		methods:{
			mins(){
				if(this.number<=this.min){
					return;
				}
				this.number--;
  				this.$emit("counter",this.number);//子传父亲
  				this.$store.dispatch("updateOrder",["counter",this.number])
			},
			maxs(){
				if(this.number>=this.max){
						return ;
				}
				this.number++;
				this.$emit("counter",this.number);
				this.$store.dispatch("updateOrder",["counter",this.number])
			},
			inputHandler(){
			   let fix;
			   
			   if(typeof this.number === 'string'){//\D元字符可以匹配非数字字符，等价于"[^0-9]"
			        fix=Number(this.number.replace(/\D/g,''));
			   }else{
			  	    fix=this.number;
			   }
			   
			    if(fix>this.max||fix<this.min){
			    	fix=this.min
			    }
			    this.number=fix;
			    this.$emit("counter",this.number);
			    this.$store.dispatch("updateOrder",["counter",this.number])
			}
		}
		
	}
</script>

<style scoped>

.counter-component {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: middle;
}
.counter-show {
  float: left;
}
.counter-show input {
  border: none;
  border-top: 1px solid #e3e3e3;
  border-bottom: 1px solid #e3e3e3;
  height: 23px;
  line-height: 23px;
  width: 30px;
  outline: none;
  text-indent: 4px;
}
.counter-btn {
  border: 1px solid #e3e3e3;
  float: left;
  height: 25px;
  line-height: 25px;
  width: 25px;
  text-align: center;
  cursor: pointer;
}
.counter-btn:hover {
  border-color: #4fc08d;
  background: #4fc08d;
  color: #fff;
}
	
</style>
