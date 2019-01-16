<template>
<!--  <div class="hello">-->
    <!--<h1>{{ msg }}</h1>
   <el-row>
	  <el-button>默认按钮</el-button>
	  <el-button type="primary">主要按钮</el-button>
	  <el-button type="success">成功按钮</el-button>
	  <el-button type="info">信息按钮</el-button>
	  <el-button type="warning">警告按钮</el-button>
	  <el-button type="danger">危险按钮</el-button>
	</el-row>
	  <div>
	  <el-button-group>
		  <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
		  <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
		</el-button-group>
		<el-button-group>
		  <el-button type="primary" icon="el-icon-edit"></el-button>
		  <el-button type="primary" icon="el-icon-share"></el-button>
		  <el-button type="primary" icon="el-icon-delete"></el-button>
		</el-button-group>
	  </div>-->
  <!--</div>-->
  <div class="block">
    <el-carousel>
      <el-carousel-item v-for="{img,index} in imgs" :key="index">
      	{{img}}
        <img :src='img' alt=''>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
//    msg: 'Welcome to Your Vue.js App',
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
 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
.el-carousel{
/*  width: 500px;*/
  height: 300px;
}

.el-carousel__item img{
  width: 500px;
  height: 300px;
}
</style>
