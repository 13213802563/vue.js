<template>
  <div class="hello">
    <h1>测试</h1>
     <!-- <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>-->
    
     <!-- <button @click="fx()">//分享图片</button> -->
      <br>
      <!-- <img style="width:200px;" src="../assets/zheng.png" alt="" srcset="">
      <br> -->
    <div>
      <button @click="getQrcode">//生成二维码</button>
      <!-- 创建一个div，并设置id为qrcode  -->
      <div style="text-align:center;background:#000;padding:40px;display:none;">
        <div style="display:inline-block;padding:6px;background:#fff;">
          <div id="qrcode" ref></div>
        </div>
      </div>
      <br>
      <button @click="downs()">//下载图片，仅pc端可用</button>
      <br>
      <br>
      <button @click="getImgSrc()">获取图片url</button>
      <br>
      <div style="text-align: center;padding: 40px;" v-if="imgSrc">
        <div id="qrcode2" style="width:200px;margin:0 auto;">
            <canvas width="200" height="200" style="display: none;"></canvas>
            <img alt="Scan me!" style="display: block;" :src="imgSrc">
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2"; // 引入qrcode
//https://www.cnblogs.com/ganws/p/11149668.html
//cnpm install --save qrcodejs2
//<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js" type="text/javascript"></script>
export default {
  name: "HelloWorld",
  data() {
    return {
      imgSrc:''
    };
  },
  components: { QRCode },
  mounted() {
    //this.qrcode();
  },
  methods: {
    getQrcode() {
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
        text: "今天天气不太好!!!!!", // 二维码内容
        render: "table", // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        colorDark: "#000000", //前景色
        colorLight: "#ffffff" //背景色
      });
    },
    getImgSrc(){
      this.getQrcode();

      setTimeout(()=>{
        let myCanvas = document.getElementById("qrcode").getElementsByTagName("canvas");
        let imgURL = myCanvas[0].toDataURL("image/jpg");
        this.imgSrc = imgURL;
        console.log(imgURL);
      },300)
    },
    fx(){
      wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: '{$appid}', // 必填，公众号的唯一标识
          timestamp: "{$signPackage.timestamp}", // 必填，生成签名的时间戳
          nonceStr: '{$signPackage.nonceStr}', // 必填，生成签名的随机串
          signature: '{$signPackage.signature}',// 必填，签名，见附录1
          jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function () {
          wx.onMenuShareTimeline({
              title: '', // 分享标题 这里设置为空
              link: '', // 分享链接 如果不想让他点开这里设置未空
              imgUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAANRElEQVR4Xu2d23bbOgwFm///6JzlnMaNLfGCEUBLzvQ1vIAbewiSdtKPP3/+fP658L/Pz3b4Hx8fzZW1+vX6UJl6MdIxr9CvQsvV6745SEB+qF6RVAFZbeu8+QTkSUsBSTRXp4LnzVI7koAISJnDKjabsmAbAwuIgJR5TkDKpJ0f2Ev6vFarW741IGe6WJLXqJsZSILouitirIilBwl52cveoFZDPPJJ84hFk1OxwArzteKk666IsSIWAdkq0MudgDzpVWHK1bssqZw3GawgO/C0PgehRrGCbBUQkJgmFR7qjWkFCShONwaPWLGjC9U5kMrppgIyLVX7mDEaQkAEZOSRsp9XmM9L+vyxp0L/t64g9BJIXlBGz3Crz/etNVRoQnecs5ivAqwKTdKPWBVmqDA6TRBJQoUmJI7eaxQdj/aj+ldoSf2FnnnPtAC68OxdtkITaszstdE4BIQqt9Ovwug0QWRZApJ3Sa/QkvrLCkJo2OlTkVQamhVk/gFidMcVEOrCp34CYgW5K1BhBloCK/oRZio0IXF4Sd9XjfrkrStIz2AtQ5/leDIq/TThK9dH74AVmw3VS0CeKFppoFGFqDDYyvVVxD/SrPVzAQkqZwUJCgaaCwgQLZtwuiMKSGLyGkMJSKLGtAQKSN7rUWI6v4YSkERFBSTP6NSYiekUkGwxBURAvhXwFWuHrtWAtACnu29FUnubENXrChtbhZZUr1/7zCsgOahQ49F+NGo6n4A8KW4FiVmQGo/2i0X3rzWdT0AEhHruqx81Hu1Hg6XzCYiAUM8JCDmnU7Up4fRzELI2GiPVxEt6nnI0d1YQK8ghF1Lj0X40WDofAoQGSfutvDhTIenasivgLQ6qF11DdjXOjmM0Xk8vAXlST0BGdpr/+VlAHUUsICOFfvxcQAJiDZoKSJ6W3ZGo0OQTWQHJSyrNW14EcyNZQeZ0OvRsGZjioal3EKpcXj8BCWhpBQmI5RErT6wjI9FS7RFrq3pFxfqVr1hHDL2yL93xW/0qYMyO8abvyjgr5lrpkSNz+b/cPqlXYQYBOWLR1/YVEAG5K7Cyqr7W9vOzC4iACEiHFwEREAERkPnXHO8gW60qNJk/5Ly2pRXECmIF6VWQz5UP44s3A7rzrXzXJ5/VLJaxO90b2+dr3R8CMm+3bOBGn2fMR/a6lgLyOu0Pz5xt6OzxBORwissHsIIEJBaQ+ceOgKynbioggfQIiIAE7HL+ptmGzh7PI9YFPOQlfT5JAmIFmXJLxdPkWb7QdxUIKl6PWmunuZky004jurYKX6I7SEUgNAnZ/QQkViVWe6EHXUUsAvKkuIAIyE8FBERA7gp4xNpuDgIiIALSObcJiIAIiIDMn6u9g8xrVfU5jq9YJ3jao0mgT5etfmcCkvzKbU+P7BfGI0DSWC5xxKp42hOQ+UpBn0+pKWm/ClgFJLskBMezgsyDagUJmqtKMBAG7iIgAjJlHnrkqSj/UwEnNRIQAZmykoDEjLLyXlaxCdGNYXUszTvI6kCmKAo2Ipc90icY1kPzio0hew10PLo2qieFrrvZtL7uLiBb2agm9HWFVglq6NZ8dDwB2VGUikl3DWq+d/7eUXYO6HgCIiCHuaYmoscJUgUFZCfNRMjbMFTMw05LgnV1/AKSl3m6aXgHCWwAAhJ7TaswJUWmIhZfsZ6yISAC8lOB9L/NSw1Gjxr0pYfsUjRGelylDxBX14R6iOrVy4+ABEgRkFh1oaAKSPBCHfDwQ9PsnVtABIR68d6P0k/NR3cpslAaYzaoo9fCq2tCPeQRK+jqbGMKiBUkaMGYYBXPcFffLangZ4G1Ig4riHcQysXUUfbqm8avBWRl4kYOJDtf9pFtdJeg82UbjGg10v8qP1/6zCsgeUfSigtpa0wBScSZikl3Sxo6ibMixuzdvqIqEa1oXs7WzwoSyIiABMR6k6YCEkikgATEepOmAhJIpIAExHqTpgISSKSABMR6k6ZL/3AcvZDSS2L2B5MUkNXrpt48y68h0/grdBaQQDYEZCsW1SQg+3RTAZmW6v+GVpCYYFaQnQ2A/C+3dNeoILxnAQERkG8FqBc8YgU8dJWNIbCkh6ZWECvIXQFy8RcQ7yBTm89VjELLakuEq6x7Kok7jawggQqSbS6atCOXbWroVqyk6oziP6IL6UvWQHUkc43WRGPpjdu9G5O/zVux8IrLdraYdN3ZcYxMRM2wsnLSNVRoKSA0G0/9BCQmJNWLbpax6P61FhCqnIB8KUB3bQFJMt5oGHofoon1DvKoANVRQEbOTvq5gCQJOfjj4t5BfMU65DS6I9Id+FCwjc5kDTR+MtdozTQW+nDR/Lr76sVVzDcSO/pzWsmi88y0X2mU1euma6vwkIDMuPFvm9VGOctrzup1C8hO5ivoD3h/qulqowjIVFrujSo8ZAUJ5EBAtmKVmPLjZsv4v5JYbg8be6GUTNZZeMV8cYn7PQREQGrLlYCkMUvP6eQ1Z/XGQNdWscl6xApYdrVRvIMEkgM/4xnNkA5IhYnOtKO0BD1TjNmxZI9305COOTJ06+f0t1kFhCr+1I8mvORYkHzJrVgbHZOmS0Be/HRMEy4g1PKxfgIiIHcFsmHNHs8jVgNuultWJCi2/4xbnynG7FiyxxMQARkT9bcF3TQqXrhasQhI4vHEV6xpNr4aCkhML9o6/Q5CA6noRxdH+lUYtkITuqv3YjnL2is2WVpx0/+6e4UZiNFHu3MrCWcxyUhHARkpNP/znpYC8qSjgMwbq6qlFSSorBVkK5gVJGiiTnMryI44HrG2opylelpBgvBbQawg3wpUQGwFsYJMbUkV5pua+KnRJSpIhVhXPzfTxNF1r6ycvVc/Gj+B40ifEs+e5TcKqTAVorRiERCapTX9KryQ/nV3+oEMlbBCFAF5VMAKsuOICuNVCF0Rp4AIyLcCVpBA6fKIFRDrBU0rNksBCSRSQAJivaCpgCw6CnrE8oj1kiPWCzaV5pQrP0mvuHtRLSt2WRpL9kaUHcdtvKVHrIoF0DEFhCpX348eZSsiE5AnVSt2WCtIzLoCEtOrpLUVpETWlEEFJEXGY4MIyDH9KnsLSKW6k2MLyKRQL2gmIDuiV5zTK+4Tl3h5OclfVlzNFs03+ro7nYyKIiBUuW0/qmX2n/3JW9HcSNSzAjKn76FWpzoWWEFCuRSQkFyssYAw3TJ7WUGCalLBgtN8NRcQolpuH5pvK0huHnZHE5AFIg+mEJBgDqhgwWmsIESwgj40390K8klHLVhg9pArd3X6ctRbM00NXTdZA42xt24Sx208+jv83VgEJAdLmlQB2SpAtRSQoJfpThqcZnjEIuONdkS6A2ebyApCs3uCfgKyTYKAxIz54RErJlirNT0WeMTyiJXjQDCKFcQK8q0A3cCsIAC8vS40AVaQk1eQ1l9WTPJN+TD0kpj9dfeKakXHrIC1lUh6p6H9qKGwTwTkUXIsZOcLgqvHFJDY0bL7IiggAkJ35dFT9JkqIN6kBERABKStwCX+j8KVF1m803jE2qTJCnJk60nqm23o7PFGx5Du+RdC5x3EO8hdgWxDZ48nIPtbwOVfsahRkgrDwzC0VJNY6O67Wi+qCV0feeYl+t/60LVVzHeJv6y4UjBqIAGh9ox9UFih8yV+o7DiLE5SJiAx1VYbdvV8VpAnPwiIgPxUQEAEJEbEU+vVO/rq+QREQASk85wuIAIiINmA0HM6/UScvmKROCve5+mYtB/VudWP6HiIuk5nqgnthypIhWB0AbQfeden66Yx0n4CslWAaikggUungFTVhflxqdFpPwERkKE76cYwHBg0oEan/QREQIY2FZAdiShxQ7UbDeh8tJ93kPlMCYiA3BXIBu42MB2T9vOS7iX9sKHJJ7J0J60wOoWAPpnP15valjQHWK/Wr9y+Q1KzzUCT8w5a1tp+fnSaAwHZUUBAtqJkazJv7ZyWApJo9Gwz0ORYQXLguI1Cc2AFSQSrJSZNjoAIyGEFqIkq+gnI4XSWDUA3KSuIFeQlL3tlJDQGFpBEo1eISQxBnpTJPDN9iCa0Ss/EE21TEUt3zN/6zBtNzJH2AnJEvce+AmIFyXNTUMvWxBWmpIusiMUKQrOR1M8KkiTkga/teElP2i3zUvlvJAHJU9UKEjR6hWB56fx/JAHJU7Qi3x6x8vKDRhIQJNtup0sAkrfcuZGyvzJym7U1JjUzeT49Ul3ofPQsPpepx1Yr80bi++6TXkGOBEP6rhRaQEiG9vuszNuRqAUkcK8RkCNWs4LkqRcYaeVOJCCBxAyarszbkaitIFaQKf/QzaE1uIBMyX680UqhqUnopXn1fF7StwpYQawgU7sUhfVXVpApRU/QiCaV7vitJVfEQd/8ab8TpPMrBKplRfz+N9BJqtKk0uNjRb8kKQ4PQ7U8PPHeSaP1dfeKySrGpGJaQSqykTMmzWnO7I+jWEGSVKVJragEHrGSknr7xoUVJEdMAcnR0TtIno6HLnQesZITkTgc3WwSQ7gPZQVJUpUm1SPWNgFUy6RUPgzzH8pGhONzsroBAAAAAElFTkSuQmCC', // 分享图标 这里设为你的图片
              success: function () { 
                  // 用户确认分享后执行的回调函数
                  alert('分享成功');
              },
              cancel: function () { 
                  // 用户取消分享后执行的回调函数
                  alert('取消分享')
              }
          });
          wx.error(function(res){
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
              alert("errorMSG:"+res);
          });
      });
    },
    downs() {
      // //找到canvas标签
      let myCanvas = document.getElementById("qrcode").getElementsByTagName("canvas");
      let img = document.getElementById("qrcode").getElementsByTagName("img");
      // // //创建一个a标签节点
      let a = document.createElement("a");
      // //设置a标签的href属性（将canvas变成png图片）
      let imgURL = myCanvas[0].toDataURL("image/jpg");
      let ua = navigator.userAgent;
      if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) {
        // IE内核 并且  windows系统 情况下 才执行;
        var bstr = atob(imgURL.split(",")[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, "下载" + "." + "png");
      } else if (ua.indexOf("Firefox") > -1) {
        //火狐兼容下载
        let blob = this.base64ToBlob(imgURL); //new Blob([content]);
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        a.download = " "; //下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
        a.href = URL.createObjectURL(blob);
        a.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          })
        ); //兼容火狐
      } else {
        //谷歌兼容下载
        img.src = myCanvas[0].toDataURL("image/jpg");
        // a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
        a.href = img.src;
        //设置下载文件的名字
        a.download = "下载";
        //点击
        a.click();
      }
    },
    //base64转blob
    base64ToBlob(code) {
      let parts = code.split(";base64,");
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: contentType });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
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
