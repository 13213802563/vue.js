<template>
  <div id="app">
    <img src="./assets/logo.png">
<!--    <HelloWorld/>-->
<!--    <HelloSwiper1/>-->
<HelloSwiper2/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import HelloSwiper1 from "@/components/HelloSwiper1";
import HelloSwiper2 from "@/components/HelloSwiper2";
export default {
  name: 'App',
  components: {
    HelloWorld,
    HelloSwiper1,
    HelloSwiper2
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
