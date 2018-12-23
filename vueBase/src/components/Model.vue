<template>
  <div class="event">
    <ul>
      <li v-on:click.once="get(name)"  v-for="name in names">{{name}}</li>
    </ul>
    <input type="text" v-on:keyup=''>
  </div>
</template>
<script>
export default {
   name: 'Model',
   data(){
  	return{
  		names:["iwen","ime","ice"],
  	}
  },
  methods:{
  	get(data){
  		console.log(this)
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
