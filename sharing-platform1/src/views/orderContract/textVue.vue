<template>
    <div>
        <mt-header :title="title" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <!--<mt-header :title="title" style="z-index: 999;width:100%;">-->
            <!--<router-link to="/index" slot="left">-->
                <!--<mt-button icon="back">返回</mt-button>-->
            <!--</router-link>-->
        <!--</mt-header>-->
        <div class="content">
            <div class="creditPrice">
                <p class="endCredit">剩余需收款金额(元)</p>
                <p class="priceNumber">{{payObj.accountAmount}}</p>
            </div>
            <van-cell-group>
                <van-field v-model="payObj.bankCardName" v-on:input="myChange"  type= "number"  @blur.native.capture="inputFun" required clearable :disabled="bankStatus == 1" label="本次收款金额:" placeholder="小于等于剩余需收款金额"/>
                <van-field v-model="payObj.bankCardNum"  clearable :disabled="bankStatus == 1" label="收款备注:" placeholder="50字以内"  maxlength="50"/>
            </van-cell-group>
        </div>
        <div class="g-buttons">
            <van-button type="primary" size="large"  @click="stepPay" :disabled="stepStatus"  style="margin-top: 1rem">下一步</van-button>
        </div>

        <div class="overlay" v-if="IsShow">
            <div class="paymentCode">
                <h1>
                    <span class="fontCode">收款码</span>
                    <span class="error" @click="errorPay">x</span>
                </h1>
                <div class="imgSrc">
                    <!--v-if="!showloading"-->
                    <van-loading type="spinner" v-if="showloading" id="showLoading"/>
                    <div class="poltr"> <canvas id="QRCode"></canvas></div>
                    <p class="clear">订单号：<span>{{payObj.orderId}}</span></p>
                    <p class="clear">订单类型：<span>{{payObj.orderType}}</span></p>
                    <p class="clear">订单金额：<span>{{payObj.orderPrice}}</span>元</p>
                    <p class="clear">本次收款金额：<span>{{payObj.orderShou}}</span>元</p>
                    <p class="clear">管家手机号：<span>{{payObj.phone}}</span></p>
                    <p class="clear">备注：<span>{{payObj.msg}}</span></p>
                </div>
                <!--                <div class="bottomSave">-->
                <!--                    <van-button type="default" class="send">发送</van-button>-->
                <!--                    <van-button type="default" class="save">保存</van-button>-->
                <!--                </div>-->
            </div>

        </div>

        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" vertical></van-loading>
            <div>加载中...</div>
        </section>
    </div>
</template>
<script>
    import { Area,NoticeBar,Dialog } from 'vant';
    import threeLevelAddress from '../../api/CityCode.json';
    import QRCode from "qrcode"; //引入生成二维码插件
    import { parse } from 'url';
    export default {
        name: "m_enterBusiness",
        data(){
            return {
                payObj:{
                    imgUrl:'',
                    price:'20000',
                    bankCardName:this.range,
                    bankCardNum:'',
                    orderId:'',
                    orderType:'',
                    orderPrice:'',
                    orderShou:'',
                    phone:'17538354687',
                    msg:'',
                    accountAmount:(!this.$route.query.orderPrice?'':this.$route.query.orderPrice),
                },
                bankStatus: 0,  //0 无银行卡（或者点修改按钮） 1
                stepStatus:false,
                bankMsg:'请完善收款信息，以便提现',
                showBankList:false,
                getBankName:'',
                QRCodeMsg: "", //生成二维码信息
                loadingimg:false,
                title:'设置收款金额',
                show: false,
                IsShow:false,
                showloading:false //loading
            }
        },
        components: {
            [Area.name]: Area
        },
        watch: {
            // 通过监听获取数据
            QRCodeMsg(val) {
                // 获取页面的canvas
                var msg = document.getElementById("QRCode");
                // 将获取到的数据（val）画到msg（canvas）上
                QRCode.toCanvas(msg, val, function(error) {
                    console.log(error);
                });
            },
        },
        mounted(){
        },
        computed:{
        },

        methods:{
            myChange: function (e) {
                var backNum = this.payObj.bankCardName;
                var dot = backNum.indexOf(".");
                var n = backNum.substr(dot + 1);//小数点后面的小数
                console.log(n);
                if (n.length>2){
                    this.payObj.bankCardName = this.payObj.bankCardName.toString().match(/^\d*(\.?\d{0,2})/g)[0] || null;
                    console.log("结果"+this.payObj.bankCardName);
                }

            },
            inputFun(){
                if(this.payObj.bankCardName<=this.payObj.accountAmount||!this.payObj.bankCardName){
                    this.payObj.bankCardName=this.payObj.bankCardName.match(/^\d*(\.?\d{0,2})/g)[0];
                }else{
                    this.payObj.bankCardName='';
                    return ;
                }
            },
            goBack(){
                this.$router.push({
                    name:'orderManagerment',
                    query:{
                        val:1,
                        mergeActive:2
                    }
                });
            },
            onInput(value) {
                this.$toast(value);
            },
            getQRCode(data) {
                this.QRCodeMsg = data;//生成的二维码为URL地址
            },
            onClickShow() {
                this.setData({ show: true });
            },
            onClickHide() {
                this.setData({ show: false });
            },
            stepPay(){
                let that=this;
                if(!that.payObj.bankCardName){
                    this.$toast('请输入小于等于剩余需收款金额的金额');
                    return;
                }else{
                    if(that.payObj.bankCardName<0.01||that.payObj.accountAmount<0.01){
                        this.$toast('金额必须大于0');
                        return ;
                    }
                    this.stepStatus=true;
                    this.IsShow=true;
                    this.showloading = true;
                    this.$postwc('/sharePlatform-order/accountPay/createAccountPay',{
                        orderSignedId:this.$route.query.orderSignedId,
                        orderContractId:this.$route.query.orderContractId,
                        // accountAmount:parseFloat(this.payObj.bankCardName).toFixed(2),
                        accountAmount:this.payObj.bankCardName,
                        remark:this.payObj.bankCardNum,
                    }).then(res =>{
                        if(res.code === 'I1-00-001'){
                            this.payObj.orderId=res.data.orderNo;
                            this.payObj.orderType=res.data.orderTypeName;
                            this.payObj.orderPrice=that.payObj.accountAmount;
                            this.payObj.orderShou=res.data.accountAmount;
                            this.payObj.phone=res.data.rechargeMobile;
                            this.payObj.msg="请于3日内完成支付";
                            this.getQRCode(res.data.paymentLink);
                            this.stepStatus=true;
                            this.showloading = false;
                        }else{
                            this.stepStatus=false;
                            this.showloading = false;
                        }
                    })
                }

            },
            errorPay(){
                this.IsShow=false;
                this.stepStatus=false;
            },
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    #showLoading{
        margin: 2rem auto;
    }
    .clear:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clear{zoom:1}
    .overlay{
        width: 100%;
        height: 100%;
        background: rgba(39, 36, 36, 0.3);
        position: absolute;
        top: 0;
        left: 0;
        .paymentCode{
            width: 80%;
            background: white;
            height: 70%;
            margin: 0 auto;
            margin-top: 5rem;
            border-radius: 7px;
            padding-bottom: 6%;
            h1{
                border-bottom: 1px solid gray;
                text-align: center;
                font-size: 1.2rem;
                line-height: 2.5rem;
                .fontCode{
                    margin: 0 auto;
                    font-size: 1.2rem;
                    line-height: 2.5rem;
                }
                .error{
                    float:right;
                    margin-right: 1rem;
                    font-size: 1.3rem;
                    line-height: 2rem;
                }
            }
            .imgSrc{
                height: 23rem;
                .poltr{
                    padding-bottom: .5rem;
                    text-align: center;
                    img{
                        margin: 0 auto;
                        width: px2rem(100px);
                        height: px2rem(100px);
                        background: green;
                        display: block;
                    }
                }
                p{
                    display: block;
                    line-height: 1.5rem;
                    padding: 2% 18%;
                    left: 10%;
                    width: 100%;
                }
            }
            .bottomSave{
                width: 100%;
                margin: 0px 10%;
                button{
                    color: white;
                    width: 38%;
                    float: left;
                    margin-right: 1rem;
                    border-radius: 10px;
                    height: 36px;
                    line-height: 34px;
                    background: darkgray;
                }
            }
        }
    }
    .creditPrice{
        width: 100%;
        text-align: center;
        font-size: px2rem(20px);
        padding: px2rem(35px) 0px;
        p{
            line-height: px2rem(40px);
        }
        .endCredit{
            font-size: px2rem(16px);
        }
        .priceNumber{
            font-size: px2rem(25px);
            color: darkgrey;
        }
        .van-cell{
            padding-top: .8rem;
            padding-bottom: .8rem;
        }

    }
    .mergeOrderBtn{
        width: 100%;
        height: px2rem(42px);
        border: none;
        background: #26a2ff;
        color: #fff;
        font-weight: bold;
        outline: none;
        margin-top: px2rem(16px);
        position: fixed;
        bottom:0;
    }
    .g-list {
        padding: 0 px2rem(15px);
        .g-sec {
            margin-bottom: 1rem;
        }
        .item {
            padding: px2rem(7px) 0;
            border-bottom: 1px solid #eee;
            select{
                border: 1px solid #ddd;
                height: 1.5625rem;
                line-height: 1.5625rem;
                width: 15rem;
                outline: none;
            }
            span {
                display: inline-block;
                min-width: 6rem;
                text-align: right;
                font-size: px2rem(14px);
                i {
                    font-style: normal;
                    color:red;
                }
            }

            input {
                border: 1px solid #ddd;
                height: px2rem(25px);
                line-height: px2rem(25px);
                width: 15rem;
                outline: none;
            }
        }

        button {
            width: 100%;
            height: 2.5rem;
            border: none;
            background: #26a2ff;
            color: #fff;
            font-weight: bold;
            outline: none;
            margin-bottom: 2rem;
            margin-top: 1rem;
        }
    }
    .content{
        padding:1rem 0rem 2rem;overflow: auto;
    }
    .loading {
        text-align:center;color:#1989fa;position: absolute;left: 0;right: 0;line-height: 40px;
        padding-top: 6rem;
        div {
            margin: 0 auto;
        }
    }
    .g-buttons {
        margin: 0 auto;
        margin-top: 2rem;
        padding:0 2rem;
        button {
            display: block;
            width: 100%;
            height: 2.2rem;
            line-height:2.2rem;
            border: none;
            background: #27a9ff;
            color: #fff;
            font-size: 1rem;
            border-radius: 10rem;
        }
    }
</style>
