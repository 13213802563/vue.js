<template>
  <div class="hello">
  	{{1+1}}
  	{{0<10?'对的':'错的'}}
    <h1>{{ msg }}</h1>
    <p v-html="msg"></p>
    <p v-text="msg"></p>
    <span class="ha">哈哈哈</span>
    {{ message.split('').reverse().join('') }}
    <p v-if='show'>
    	<span>我是if</span>
    	<span>哈哈</span>
    </p>
    <p v-show='show'>
    	<span>我是if</span>
    </p>
    <p v-if='ok'>我是对的</p>
    <p v-else='ok'>我是错的</p>
    <div class='list'>
    	<ul>
    		<li v-for='(name,index) in names' :key='index'>{{name}}{{index}}</li>
    	</ul>
    	 <ul>
    		<li v-for='item in user'>
    			<span>{{item.name}}</span>
    			<span>{{item.id}}</span>
    		</li>
    	</ul>
    </div>
    <button v-on:click="num+=1">按钮1</button>
    <p>{{num}}</p>
    <button v-on:click="handerClick">按钮2</button>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
    	num:1,
      msg: 'Hello vue',
      flag:'我是flag',
      message:'hello',
      show:false,
      ok:true,
      names:['孔力明','张三','国军下'],
      user:[
      {
      	id:0,
      	name:"长安"
      },
      {
      	id:1,
      	name:"长安1"
      },
      {
      	id:2,
      	name:"长安2"
      }
      ]
    }
  },
  methods:{
  	handerClick(){
  		alert(this);
  		this.show=!this.show;
  	}
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
