<template>
  <div id="app">
    <img src="./assets/logo.png">
<!--   <HelloWorld/>-->
     <!-- <navList/> -->
   <router-view></router-view> 
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld'
 // import navList from  './components/NavList'
export default {
  name: 'App',
  data(){
    return{}
  },
  components: {
//  HelloWorld
   // navList
   
  }
}
</script>

<style>
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
  .active{
  	color:red;
  }
</style>
