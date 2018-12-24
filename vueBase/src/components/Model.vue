<template>
  <div class="event">
    <ul>
      <li v-on:click.once="getItemInfo(name)"  v-for="name in names">{{name}}</li>
    </ul>
    <input type="text" v-on:keyup.enter='getkeyInfo'>
    <button v-on:click="pushArr">按钮</button>
    <button>我要奇数</button>
  </div>
</template>
<script>
export default {
   name: 'Model',
   data(){
  	return{
  		names:["iwen","ime","ice"],
//		nums:[1,2,3,4,5,6,7]
  	}
  },
  methods:{
  	getItemInfo(data){
     console.log(data);
  	},
  	getkeyInfo(event){
  		console.log(event);
  	},
  	pushArr(){
  	  this.names.push("frank");
//	  this.name.concat(['frank']);
  	},
//	getOdd(){
//		this.nums.filter(function(num){
//		 if(num%2!==0){
//		 this.wantNums.push(num);
//		 }
//		})
//	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
