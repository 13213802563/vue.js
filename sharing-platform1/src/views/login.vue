<template>
    <div class="login-body">
        <div class="g-logo">
            <p class="u-text-title">欢迎使用家政共享平台</p>
        </div>
        <div class="content">
            <div class="ym-tab" style="padding-top:2.5rem;">
                <div class="ym-tab-title">
                    <div class="ym-tab-title-item" style="border-right:1px solid #fff;"
                        :class="logType == 0 ?  'active':''"
                        @click="logType = 0;">账号登录</div>
                    <div class="ym-tab-title-item"
                        :class="logType == 1 ?  'active':''"
                        @click="logType = 1">短信登录</div>
                </div>
                <div class="ym-tab-content">
                    <div v-if="logType == 0" class="ym-tab-content-item">
                        <div class="input_box login_input_box">
                            <!-- <div class="div">
                                <p class="p">账&nbsp;&nbsp;&nbsp;&nbsp;号:</p>
                                <input class="input" type="text" v-model="userInfo.username" maxlength="16">
                                <span></span>
                            </div>
                            <div class="div">
                                <p class="p">密&nbsp;&nbsp;&nbsp;&nbsp;码:</p>
                                <input class="input" type="password" v-model="userInfo.password" maxlength="16">
                            </div> -->
                            <van-field clearable error-message="" v-model="userInfo.username" label="账号:" placeholder="请输入账号/手机号" maxlength="16"/>
                            <van-field clearable error-message="" v-model="userInfo.password" label="密码:" placeholder="请输入密码" maxlength="16"
                                :type=" eye == false ? 'password' : 'text' "
                                :right-icon=" eye == false ? 'closed-eye' : 'eye-o' "
                                @click-right-icon=" eye = !eye"/>
                            <div class="div" style="color:#fff;font-size:12px;text-align:right;padding-right:10px;"
                                @click="$router.push('/index/passWordForget')">忘记密码？</div>
                        </div>
                        <div class="g-buttons">
                            <button @click="toLogin">登录</button>
                            <button @click="toRegCompany"  style="margin-top: 1rem">注册</button>
                        </div>
                    </div>
                    <div v-if="logType == 1" class="ym-tab-content-item">
                        <div class="input_box login_input_box">
                            <van-field clearable error-message="" v-model="userInfo.mobile" label="手机号:" placeholder="请输入手机号" maxlength="11"/>
                            <van-field clearable v-model="userInfo.verificationCode" center label="验证码:" placeholder="请输入短信验证码" maxlength="6">
                                <van-button slot="button" plain size="small" type="info" :disabled="timeBtn" @click="checkUser" ref="time">{{time}}</van-button>
                            </van-field>
                        </div>
                        <div class="g-buttons">
                            <button @click="toLoginByYzm">登录</button>
                            <button @click="toRegCompany"  style="margin-top: 1rem">注册</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return {
                userInfo:{
                    mobile:'',
                    userName:'',
                    password:'',
                    verificationCode:'',//验证码
                    isBtns:false
                },
                eye:false,  //false隐藏密码，true显示密码
                time:'获取验证码',
                timeBtn:false,

                logType:0,// 0、账后手机号登录 1、短信验证码登录
                username:'',
                password:'',
                active: 0
                // bodyHeight:0,
            }
        },
        methods:{
            //获取验证码前验证用户是否存在
            checkUser(){
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;
                if (this.userInfo.mobile == '') {
                    this.$toast('手机号不能为空');
                    return false;
                }else if(!mobileReg.test(this.userInfo.mobile)){
                    this.$toast('手机号不合法')
                    return false;
                }

                this.timeBtn = true;

                let params = {'mobile': this.userInfo.mobile};
                let url = '/sharePlatform-auth/auth/guest/checkUser';
                this.$postwc(url,params).then(res => {
                    if(res.status == 0){
                        this.getYzm();
                    }else{
                        this.timeBtn = false;
                        this.$toast(res.msg);
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
            toLoginByYzm(){
                var that = this;
                that.kickBack()
                var reg = /^[0-9a-zA-Z_]{1,16}$/
                var reg2 = /^\d+?.*$/
                let regUserName = /^[a-zA-Z0-9_-]{1,16}$/;

                setTimeout(function () {
                    document.activeElement.blur()
                },300)
                //=========手机号===================
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;
                if (this.userInfo.mobile == '') {
                    this.$toast('手机号不能为空');
                    return false;
                }else if(!mobileReg.test(this.userInfo.mobile)){
                    this.$toast('手机号不合法');
                    return false;
                }
                //============验证码==================
                if(this.userInfo.verificationCode == ''){
                    this.$toast('验证码不能为空');
                    return false;
                }
                localStorage.setItem('login_mobile',that.userInfo.mobile);
                localStorage.setItem('login_yzm',that.userInfo.verificationCode);
                this.$postNoToken('/sharePlatform-auth/auth/guest/loginByPhone',{
                    mobile:that.userInfo.mobile,
                    code:that.userInfo.verificationCode
                })
                    .then(function (res) {
                        if(res.code === 'I1-00-001'){
                            that.$toast('企业登录成功');
                            localStorage.setItem('token',res.data['jzpt-token']);
                            localStorage.setItem('companyId',res.data.regions[0].bmsAdminRegionId);
                            // 存储分区值
                            that.$store.state.areas = res.data.regions
                            localStorage.setItem('areas',JSON.stringify(res.data.regions));
                            that.$router.push('/areas')
                        }else {
                            that.$toast(res.msg);
                        }
                    })
            },
            toLogin(){
                var that = this;
                that.kickBack()
                var reg = /^[0-9a-zA-Z_]{1,16}$/
                var reg2 = /^\d+?.*$/
                let regUserName = /^[a-zA-Z0-9_-]{1,16}$/;

                setTimeout(function () {
                    document.activeElement.blur()
                },300)
                //=========账号===================
                if (this.userInfo.username == '') {
                    that.$toast('账号不能为空');
                    return false;
                }
                // else if (reg2.test(this.userInfo.username)) {
                //     that.$toast('账号不能以数字开头');
                //     return false;
                // }
                else if (/^-/.test(this.userInfo.username)) {
                    that.$toast('账号不能以“中划线”开头');
                    return false;
                }
                else if (!regUserName.test(this.userInfo.username)) {
                    that.$toast('账号只能是字母、数字、下划线、中划线，且长度最长为16位');
                    return false;
                }
                //==========密码===================
                else if (this.userInfo.password == '') {
                    that.$toast('密码不能为空');
                    return
                }
                // else if (this.password.length < 5) {
                //     that.$toast('密码长度不能小于5位');
                //     return
                // }
                else if (!reg.test(this.userInfo.password)) {
                    that.$toast('密码只能是字母、数字、下划线，且长度最长为16位');
                    return
                } else if (reg2.test(this.userInfo.password)) {
                    that.$toast('密码不能以数字开头');
                    return
                }
                // 暂存帐号密码
                that.$store.state.userName = that.userInfo.username
                that.$store.state.password = that.userInfo.password
                localStorage.setItem('userName',that.userInfo.username);
                localStorage.setItem('password',that.userInfo.password);
                this.$postNoToken('/sharePlatform-auth/auth/guest/login',{
                    userName:that.userInfo.username,
                    password:that.userInfo.password
                })
                    .then(function (res) {
                        if(res.code === 'I1-00-001'){
                            if(res.data.regions){
                                that.$toast('企业登录成功');
                                localStorage.setItem('token',res.data['jzpt-token']);
                                localStorage.setItem('companyId',res.data.regions[0].bmsAdminRegionId);
                                // 存储分区值
                                that.$store.state.areas = res.data.regions;
                                localStorage.setItem('areas',JSON.stringify(res.data.regions));
                                that.$router.push('/areas');
                            }
                        }else {
                            that.$toast(res.msg);
                        }
                    })
            },
            toRegCompany(){
                this.$router.push('/reg')
            },
            fun(){
                console.log('/**/')
                this.$router.replace('/')
            },
            kickBack() {
                setTimeout(() => {
                    window.scrollTo(0, document.body.scrollTop + 1);
                    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
                }, 10)
            }
        },
        watch:{
            logType:(val)=>{
                localStorage.setItem('logType',val);
            }
        },
        mounted() {
            //this.bodyHeight=document.documentElement.clientHeight
            //本地有token,说明用户已经登录过了,跳过登录界面，直接进入 areas 页面
            if(localStorage.getItem('token')){
                //判断areas长度，如果areas长度是1的划直接跳入index页面
                let areas = JSON.parse(localStorage.getItem('areas'));
                if(areas.length == 1){
                    if(localStorage.getItem('auth')){
                        this.$router.push(`/index?id=${areas[0].bmsAdminRegionId}`)
                        return false;
                    }
                }
                this.$router.push('/areas');
                return false;
            }

            localStorage.clear();
            localStorage.setItem('logType',this.logType);
            let that =this
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                console.log('app')
            })

        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .login-body {
        background: url("../assets/login-bg.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: top;
        width: 100vw;
        height: 100vh;
        overflow: scroll;
    }
    .g-logo {
        overflow: hidden;
        min-height: 3rem;
        padding: 0 2rem;
        .u-text-title {
            text-align: center;
            margin-top: px2rem(50px);
            font-size: px2rem(20px);
            font-weight: bold;
            color: #fff;
        }
    }
    .content{
        color:#fff;
        .input_box{
            overflow: hidden;
            min-height: 3rem;
            padding: 0 2rem;
            height: 13rem;
            .div {
                display: block;
                margin-top: 2rem;
                .p {
                    text-align: left;
                    color: #fff;
                }
                .input {
                    border:none;
                    height: px2rem(25px);
                    outline: none;
                    width: 100%;
                    background: none;
                    border-bottom: 1px solid #fff;
                    color: #fff;
                    font-weight: bold;
                }
            }
        }
        .g-buttons {
            margin: 0 auto;
            margin-top: 2rem;
            padding: 0 2rem;
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

    }
    .ym-tab-title{
        display: flex;
        .active{color:#27a9ff;}
        .ym-tab-title-item{flex: 1;text-align: center}
    }

</style>
