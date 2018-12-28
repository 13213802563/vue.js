<template>
  <div id="app">
<!--      <Model/>-->
<!--    <HelloWorld/>-->
<!--       <Compute/>-->
<!--       <Myprop/>-->
     <!--  <Parent/>-->
    <!-- <parents/>-->
     <parent/>
     <big/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Model from './components/Model';
import Compute from './components/Compute';
import Myprop from './components/Myprop';
import Parent from './components/Parent';
import parents from  './components/parentSon/parents';
import parent from  './components/slots/parent';
import big from  './components/comkeep/big';


export default {
  name: 'App',
  components: {
    HelloWorld,
    Model,
    Compute,
    Myprop,
    Parent,
    parents,
    parent,
    big  
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


