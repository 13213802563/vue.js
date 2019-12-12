<template>
    <div>
        <mt-header title="输入提现金额" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="goBack()" slot="left">返回</mt-button>
        </mt-header>
        <div style="color: #323233;font-size: 14px;line-height: 24px;text-align:center;padding: 50px 15px;">
            <div style="padding: 10px 15px;">
                可提现收入（元）
            </div>
            <div style="font-size: 34px;padding: 10px 15px;">
                {{balance}}
            </div>
        </div>
        <div class="content">
            <van-cell-group >
                <van-field v-model="payMoneyValue" required clearable readonly clickable label="提现金额:" placeholder="请输入提现金额" @click="showNumberKeyboard = true"/>
                <van-field v-model="mobile" required clearable readonly clickable label="绑定手机号:" disabled @click="showNumberKeyboard = true"/>
                <van-field required clearable v-model="verificationCode" center label="验证码:" placeholder="请输入短信验证码" maxlength="6">
                    <van-button slot="button" plain size="small" type="info" :disabled="timeBtn" @click="getYzm" ref="time">{{time}}</van-button>
                </van-field>
            </van-cell-group>
            <div style="color: #323233;font-size: 14px;padding: 10px 15px;margin-top:15px;">
                <div>{{'注：'}}</div>
                <div>{{'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.周一0点至周三24点提现金额，周四到账。'}}</div>
                <div>{{'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.周四0点至周日24点提现金额，下周二到账。'}}</div>
            </div>
           <div class="g-buttons">
               <van-button disabled  type="info"  size="large"  @click="save" :disabled="savebtn1"  v-if="fromRouter != '/index/subCommission'">保存</van-button>
                <!--<button type="primary" size="large" @click="save" :disabled="savebtn1"  v-if="fromRouter != '/index/subCommission'" ref="save">保存</button>-->
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" vertical></van-loading>
            <div>加载中...</div>
        </section>
        <van-number-keyboard
            :show="showNumberKeyboard"
            v-model="keyValue"
            extra-key="."
            close-button-text="完成"
            @blur="showNumberKeyboard = false"
            @input="onInput"
            @delete="onDelete"
        />
    </div>
</template>
<script>
    import { Dialog } from 'vant';
    export default {
        name: "m_cashWithdrawal",
        data(){
            return {
                fromRouter:'',
                loadingimg: false,
                showNumberKeyboard:false,
                keyValue:'',
                payMoneyValue:'',
                savebtn1:true,
                time:'获取验证码',
                timeBtn:false,
                verificationCode:'',
                balance:'',
                mobile:sessionStorage.getItem('mobile')
            }
        },
        mounted(){
            //可提现金额
            this.balance = sessionStorage.getItem('balance')?sessionStorage.getItem('balance'):'';
            this.fromRouter = this.$route.query.url;
        },
        methods:{
            //获取验证码
            getYzm(){
                if(this.checkInput() == false) return false;
                if(this.mobile == 'null'){
                    return false;
                };
                this.timeBtn = true;
                // debugger
                let timer;
                let time = 60;
                let params = {'receiverPhone': this.mobile};
                let url = '/sharePlatform-auth/auth/guest/sendCode';
                this.$postwc(url,params).then(res => {

                    this.loadingimg = false;
                    if(res.code==="I1-00-001"){
                        this.savebtn1=false;
                        this.$toast('验证码发送成功');
                        timer = setInterval( ()=> {
                            time--;
                            if(time == 0) {
                                clearInterval(timer);
                                this.time = "重新获取";
                                this.timeBtn = false;
                            } else {
                                this.time = time + " 秒后重试";
                            }
                        }, 1000)
                    }

                }).catch( err => {
                    this.timeBtn = false;
                    this.$toast('网络异常，请稍后再试');
                });
            },
            goBack(){
                this.$router.back(-1);
                // var url = this.$route.query.url;
                // this.$router.push
                // this.$router.push({path:'/index/m_receivables',query:{url:'/index/subCommission'}})
            },
            onInput(value) {
               this.payMoneyValue += value.toString();
            },
            onDelete() {
                if(this.payMoneyValue.length>0){
                    this.payMoneyValue = this.payMoneyValue.slice(0,-1);
                };
            },
            checkInput(){
                if(this.balance<=0){
                    this.$toast('无可提现金额')
                    return false;
                }
                if(this.payMoneyValue.length<=0){
                    this.$toast('提现金额不能为空')
                    return false;
                };
                if(Number(this.payMoneyValue) > this.balance){
                    this.$toast('提现金额不能大于可提现金额')
                    return false;
                };
                return true;
            },
            save(){
                if(this.checkInput() == false) return false;
                if(this.verificationCode == ''){
                    this.$toast('验证码不能为空');
                    return false;
                };
                let url = '/sharePlatform-order/accountPay/withdrawMoney';
                this.$postwc(url,{
                    bankCardId:JSON.parse(sessionStorage.getItem('bankCard')).userBankcardId,
                    money:this.payMoneyValue,
                    code:this.verificationCode,
                    mobile:this.mobile
                }).then(res=>{
                    if(res.code == 'I1-00-001'){
                        this.$router.push('/index/subCommission');
                        this.$toast('已发起提现，请耐心等待提现到账');
                    }
                    else {
                        this.$toast(res.msg)
                    }
                }).catch(err =>{
                    this.$toast('网络请求超时')
                })
            }
        },
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
    @return $px / 16px * 1rem
    }
    .content{
        padding:1rem 0rem 2rem;overflow: auto;
    }
    .savegrey{
        background: darkgrey;
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
            height: 2.6rem!important;
            border: none;
            background: #27a9ff;
            color: #fff;
            font-size: 1rem;
            border-radius: 10rem;
            line-height: 2.6rem;
        }
    }
</style>
