<template>
  <div class="hello">
    <el-carousel>
      <el-carousel-item v-for="(img,index) in imgs" :key="index">
        <img :src="img" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      imgs:[
        "http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner1.jpg",
        "http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner2.jpg",
        "http://www.wwtliu.com/sxtstu/blueberrypai/indexImg/banner3.jpg"
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-carousel{
  width: 500px;
  height: 300px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
   background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
   background-color: #d3dce6;
}

.el-carousel__item img{
  width: 500px;
  height: 300px;
}