<template>
    <div>
        <mt-header title="绑定手机号" style="z-index: 999;">
            <mt-button icon="back" @click="goBack()" slot="left">返回</mt-button>
        </mt-header>
        <div class="content">
            <!-- 展示已绑定的手机号 -->
            <div v-if="bdMobile">
                <van-notice-bar  text="该账户已经绑定手机号，可以进行更换" left-icon="volume-o"/>
                <br>
                <div style="text-align:center;padding:20px 20px 10px;">
                    <van-icon name="phone" size="64px"/>
                    <br>
                    <br>
                    <br>
                    <van-cell-group>
                        <van-field v-model="userInfo.mobile" disabled clearable label="手机号:" placeholder="请输入手机号" error-message=""/>
                    </van-cell-group>
                </div>
                <div class="g-buttons">
                    <button @click="checkMobile" type="primary" size="large">更改手机号</button>
                </div>
            </div>
            <br>
            <!-- 没有手机号，或者更改手机号 -->
            <div v-if="bdMobile == false">
                <van-cell-group >
                    <van-field v-model="userInfo.mobile" clearable label="手机号:" placeholder="请输入手机号" error-message="" maxlength="11"/>
                    <van-field v-model="userInfo.yzm" center clearable label="验证码:" placeholder="请输入短信验证码" maxlength="6">
                        <van-button slot="button" plain size="small" type="info" 
                            :disabled="timeBtn" @click="checkUser" ref="time">
                                {{time}}
                        </van-button>
                    </van-field>
                </van-cell-group>
                <div class="g-buttons">
                    <button @click="save" type="primary" size="large">保存</button>
                </div>
            </div>
            
        </div>
        <section class="loading" v-show="loadingimg">
            <!-- <van-loading type="spinner" color="#1989fa" /> -->
            <van-loading type="spinner" color="#1989fa" vertical></van-loading>
            <div>加载中...</div>
        </section>
    </div>
</template>

<script>
    import { Field } from 'vant';
    import { Uploader } from 'vant';
    import { Loading } from 'vant';
    export default {
        name: "per-center-mobile",
        data () {
            return {
                bdMobile:false,//false 手机号为空，或更改手机号
                userInfo:{
                    mobile:'',//改字段为空时 ，未绑定手机号，或者更改手机号
                    bmsUserId:'',
                    yzm:''
                },
                loadingimg: false,
                time:'获取验证码',
                timeBtn:false,
                isBtns:false  //防止保存按钮重复点击
            }
        },
        created () {

            
            if(this.$route.query.mobile != "未绑定" && this.$route.query.mobile){
                console.log(this.$route.query.mobile);
                this.userInfo.mobile = this.$route.query.mobile;
                this.bdMobile = true;
            }
            this.userInfo.bmsUserId = this.$route.query.bmsUserId;
            
            // let params = {};
            // let url = '/sharePlatform-auth/accountSafe/queryPhoneByAccount';
            // this.$postwc(url,params).then(res => {
            //     console.log(res);
            //     if(res.status == 0){
            //         if(res.data.mobile){
            //             this.userInfo.mobile = res.data.mobile;
            //             this.bdMobile = true;//有手机号
            //         }
            //         this.userInfo.bmsUserId = res.data.bmsUserId;
            //     }
            // });
        },
        methods:{
             goBack(){
                if( this.$router.query.url){
                    this.$router.push(this.$route.query.url)
                }
                else{
                    this.$router.push('/index/accountSecurity')
                }
            },
            checkMobile(){
                this.userInfo.mobile = '';
                this.userInfo.yzm = '';
                this.bdMobile = false;
            },
            //获取验证码前验证用户是否存在
            checkUser(){
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;
                if (this.userInfo.mobile == '') {
                    this.$toast('手机号不能为空');
                    return false;
                }else if(!mobileReg.test(this.userInfo.mobile)){
                    this.$toast('手机号不合法')
                    return false;
                };

                this.timeBtn = true;

                let params = {'mobile': this.userInfo.mobile};
                let url = '/sharePlatform-auth/auth/guest/checkUser';
                this.$postwc(url,params).then(res => {
                    if(res.status == 0){
                        this.timeBtn = false;
                        this.$toast(res.msg);
                    }else{
                        this.getYzm();
                    }
                }).catch( err => {
                    this.timeBtn = false;
                    this.$toast('网络异常，请稍后再试');
                });
            },
            //获取验证码
            getYzm(){
                let timer;
                let time = 60;
                let params = {'receiverPhone': this.userInfo.mobile};
                let url = '/sharePlatform-auth/auth/guest/sendCode';
                this.$postwc(url,params).then(res => {
                    this.loadingimg = false;
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
                }).catch( err => {
                    this.timeBtn = false;
                    this.$toast('网络异常，请稍后再试');
                });
            },
            save(){
                let that = this;
                

                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;
                if (this.userInfo.mobile == '') {
                    that.$toast('手机号不能为空');
                    return false;
                }else if(!mobileReg.test(this.userInfo.mobile)){
                    that.$toast('手机号不合法');
                    return false;
                }

                if(this.userInfo.yzm == ''){
                    this.$toast('验证码不能为空');
                    return false;
                } 

                if(that.isBtns){ return false };
                that.isBtns=true;

                this.$postwc('/sharePlatform-auth/accountSafe/bindPhoneToAccount',{
                    bmsUserId:that.userInfo.bmsUserId,
                    mobile:that.userInfo.mobile,
                    code:that.userInfo.yzm
                }).then(function (res) {
                    if(res.code === 'I1-00-001'){
                        that.$toast('绑定成功');
                        that.isBtns=false;
                        that.bdMobile = true;
                        if(this.$router.query.goUrl){
                            let url = this.$route.query.url;
                            let goUrl = this.$router.query.goUrl
                            this.$router.push({path:goUrl,query:{url:url}});
                        }
                    }else{
                        that.$toast(res.msg)
                        that.isBtns=false;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    $color:red;
    $color:#27a9ff;
    .content{
        padding:0rem 0rem 2rem;position: absolute;top: 40px;bottom: 0;left: 0;right: 0;overflow: auto;
        //获取验证码按钮
        .van-button--plain.van-button--info {
            width: 84px;
            color: $color;
            border: 1px solid $color;
        }
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
            border: none;
            background: #27a9ff;
            color: #fff;
            font-size: 1rem;
            border-radius: 10rem;
        }
    }
</style>
