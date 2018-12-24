<template>
  <div id="app">
    <img src="./assets/logo.png">
<!--      <Model/>-->
<!--    <HelloWorld/>-->
<!--       <Compute/>-->
       <Myprop/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Model from './components/Model';
import Compute from './components/Compute';
import Myprop from './components/Myprop'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Model,
    Compute,
    Myprop
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

