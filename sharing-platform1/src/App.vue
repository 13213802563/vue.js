<template>
  <div id="app">
    <!--<div id="nav">-->
      <!--<router-link to="/">Home</router-link> |-->
      <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: "app",
    mounted() {
      let that = this;
      let url = window.location.href;
      console.log('当前运行环境为' + this.$env)
      if(!localStorage.getItem('token')){
        debugger
        if(url.search(/viewContract/) ===-1&&url.search(/payrollSms/)===-1){
          that.$router.push('/')
        }
      }
    },
    watch: {
      '$route':function (to,from){
        //to表示的是你要去的那个组件，from 表示的是你从哪个组件过来的，它们是两个对象，你可以把它打印出来，它们也有一个param 属性
        let router = {'to':{'name':to.name,'fullPath':to.fullPath},'from':{'name':from.name,'fullPath':from.fullPath}};
        sessionStorage.setItem('routerStorage',JSON.stringify(router));
      }
    },
    methods:{ },
    data(){
      return {
      }
    }

  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: #ffffff;
  min-height: 100vh;
}

</style>
