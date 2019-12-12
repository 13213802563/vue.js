<template>
  <div class="hello">
    <van-dialog
      v-model="show"
      :title="msg"
      close-on-click-overlay
      :show-confirm-button="true"
    >
      <div style="padding: 10px;" v-if="imgSrc">
        <div style="width:200px;margin:0 auto;">
          <canvas width="200" height="200" style="display: none;"></canvas>
          <img alt="Scan me!" style="display: block;" :src="imgSrc">
        </div>
      </div>
      
    </van-dialog>
    <div>
      <!-- 创建一个div，并设置id为qrcode  -->
      <div style="width:200px;margin:0 auto;display:none;">
        <div id="qrcode" ref ="qrcode"></div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2"; // 引入qrcode
import {Dialog} from 'vant';
export default {
  name: "getQrcode",
  data() {
    return {
      imgSrc:'',
      show:false
    };
  },
  props:['link','msg'],
  watch:{
    show:function(val){
      this.$store.commit('QrCodeshow', val)
    },
    QrCodeshow:function(val){
      this.show = val;
    },
    QrCodeLink:function(val){
      if(val) this.getImgSrc();
    }
  },
  computed: {
    QrCodeshow () {
      return this.$store.state.QrCodeshow
    },
    QrCodeLink(){
      return this.$store.state.QrCodeLink
    }
  },
  components: { 
    QRCode
  },
  mounted(){
    
  },
  methods: {
    changeShow(val){
      
    },
    getImgSrc(){
      this.drawQrcode()
      setTimeout(()=>{
        let myCanvas = document.getElementById("qrcode").getElementsByTagName("canvas");
        let imgURL = myCanvas[0].toDataURL("image/jpg");
        this.imgSrc = imgURL;
      },300)
    },
    drawQrcode() {
      document.getElementById("qrcode").innerHTML = "";
      this.$nextTick(function() {
        //生成二维码
        this.qrcode();
      });
    },
    qrcode() {
      let that = this;
      let qrcode = new QRCode("qrcode", {
        width: 200,
        height: 200, // 高度
        text: this.QrCodeLink, // 二维码内容
        render: "table", // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        colorDark: "#000000", //前景色
        colorLight: "#ffffff" //背景色
      });
    }
  }
};
</script>

<style scoped lang="scss">

</style>
