<template>
    <div>
        <mt-header title="公司注册" style="background: #27a9ff">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回登录</mt-button>
            </router-link>
        </mt-header>
        <div class="content">
            <van-cell-group>
                <van-field required clearable error-message="" v-model="userInfo.companyName" label="公司名称:" placeholder="请输入公司名称"/>
                <van-field required clearable error-message="" v-model="userInfo.userName" label="账号:" placeholder="请输入账号" maxlength="16"/>
                 <!-- <van-field required clearable error-message="" v-model="userInfo.userName" label="账号:" placeholder="请输入账号" maxlength="16" right-icon="question-o"
                  @click-right-icon="$toast('账号必须以字母开头，只能包含字母、数字、下划线，且长度最短为5位，长度最长为16位，最长为16位')" />-->
                <van-field required clearable error-message="" v-model="userInfo.userPassword" label="密码:" placeholder="请输入密码" maxlength="16"
                    :type=" eye == false ? 'password' : 'text' " 
                    :right-icon=" eye == false ? 'closed-eye' : 'eye-o' "
                    @click-right-icon=" eye = !eye"/>
                <van-field required clearable error-message="" v-model="userInfo.nextPassword" label="确认密码:" placeholder="请再次输入密码" maxlength="16" type="password"/>
                <van-field required clearable error-message="" v-model="userInfo.mobile" label="手机号:" placeholder="请输入手机号" maxlength="11"/>
                <van-field required clearable v-model="userInfo.verificationCode" center label="验证码:" placeholder="请输入短信验证码" maxlength="6">
                    <van-button slot="button" plain size="small" type="info" :disabled="timeBtn" @click="checkUser" ref="time">{{time}}</van-button>
                </van-field>
                <van-field required clearable error-message="" v-model="userInfo.address" type="textarea" autosize rows="1" label="企业地址:" placeholder="请输入企业地址" maxlength="100"/>
             
                <div class="van-cell van-field">
                    <div class="van-cell__title van-field__label" style="display:flex;align-items:center;">
                        <span>营业执照:</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                            <div class="demo-uploader">
                                <div class="van-uploader">
                                    <div class="van-uploader__wrapper">
                                        <div class="van-uploader__upload" :style="{'background-image':'url(' + userInfo.businessLicense +')'}">
                                            <i class="van-icon van-icon-plus van-uploader__upload-icon" v-if="userInfo.businessLicense == ''"></i>
                                              <input @change="changeIdCard1" type="file" class="van-uploader__input" ref="inputer" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </van-cell-group>
            <div class="g-buttons">
                <button @click="save" type="primary" size="large">保存</button>
                <button @click="reset" type="primary" size="large" style="margin-top: 1rem">重置</button>
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
    import { truncateSync } from 'fs';
    export default {
        name: "reg",
        data(){
            return {
                userInfo:{
                    companyName:'',
                    mobile:'',
                    address:'',
                    userName:'',
                    userPassword:'',
                    nextPassword:'',
                    verificationCode:'',//验证码
                    businessLicense:'',//营业执照
                    isBtns:false
                },
                eye:false,  //false隐藏密码，true显示密码
                loadingimg: false,
                time:'获取验证码',
                timeBtn:false
            }
        },
        methods: {
            //获取验证码前验证用户是否存在
            checkUser(){
                if(this.checkYzm() == false) return false;

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
            //点击事件 选择营业执照前
            clickImg(e){
                console.log(e);
                if(this.checkYzm() == false) return false;
                if(this.checkImg() == false) return false;
            },
            //change事件 选择营业执照后
            changeIdCard1(e){
                let that = this;
                console.log(e.target.files[0])
                if(e.target.files[0] == undefined) return false;
                let size = e.target.files[0].size //图片的大小 MB  大小不超过5M
                if (size > 10*1024*1024) {
                    this.$toast('请选择10M以内的图片！');
                    return false;
                }
                this.loadingimg = true;
                this.$file(e.target.files[0]).then(res => {
                    //{"errMsg":"不允许上传的类型,只支持格式GIF、PNG、JPG!","recode":20006}
                    //{"reUrl":["https://static.dingtalk.com/media/lADPBE1XYe3XsC3NBP7NAk4_590_1278.jpg"],"recode":0}
                    //console.log(res);
                    this.loadingimg = false;
                    if(res.recode == 2006){
                        this.$toast(res.errMsg)
                    }else if(res.recode == 0){
                        this.userInfo.businessLicense = res.reUrl[0];
                    }else{
                        this.$toast('网络延迟，请稍后再试')
                    };
                    
                }).catch(function (error) {
                    this.loadingimg = false;
                    console.log(error);
                });
            },
            reset(){
                for(let key in this.userInfo){
                    if(this.userInfo.hasOwnProperty(key)){
                        this.userInfo[key] = ''
                    }
                };
                this.$refs.inputer.value = '';  //移除file内容
                this.userInfo.businessLicense = '';//清空预览图片
                console.log(this.$refs.inputer.files);
            },
            //获取验证码之前的部分做校验
            checkYzm(){
                let that = this;
                var reg = /^[a-zA-Z0-9_]{5,16}$/
                var reg2 = /^\d+?.*$/
                let vegCN = /[\u4e00-\u9fa5]/ig
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;

                let regUserName = /^[a-zA-Z0-9_-]{5,16}$/;
                //==========公司名称===============
                if (this.userInfo.companyName == '') {
                    that.$toast('公司名称不能为空');
                    return false;
                } 
                //==========账号===============
                else if (this.userInfo.userName == '') {
                    that.$toast('账号不能为空');
                    return false;
                } 
                else if (reg2.test(this.userInfo.userName)) {
                    that.$toast('账号不能以数字开头');
                    return false;
                } else if(vegCN.test(this.userInfo.userName)){
                    that.$toast('帐号中不能存在中文字符')
                     return false;
                }
                else if (/^-/.test(this.userInfo.userName)) {
                    that.$toast('账号不能以“中划线”开头');
                    return false;
                } 
                else if (!regUserName.test(this.userInfo.userName)) {
                    that.$toast('账号只能是字母、数字、下划线、中划线，且长度最短为5位，长度最长为16位');
                    return false;
                } 
                
                //==========密码================
                else if (this.userInfo.userPassword == '') {
                    that.$toast('密码不能为空');
                    return false;
                }
                else if (reg2.test(this.userInfo.userPassword)) {
                    that.$toast('密码不能以数字开头');
                    return false;
                }
                else if (!regUserName.test(this.userInfo.userPassword)) {
                    that.$toast('密码只能是字母、数字、下划线，且长度最短为5位，长度最长为16位');
                    return false;
                }
                //==========再次输入密码================
                else if (this.userInfo.nextPassword == '') {
                    that.$toast('请再次输入密码');
                    return false;
                }
                else if (this.userInfo.nextPassword != this.userInfo.userPassword) {
                    that.$toast('两次输入密码不一致');
                    return false;
                } 
                //============手机===================
                else if (this.userInfo.mobile == '') {
                    that.$toast('手机号不能为空');
                    that.isBtns=false;
                    return false;
                }else if(!mobileReg.test(this.userInfo.mobile)){
                    that.$toast('手机号不合法')
                    that.isBtns=false;
                    return false;
                }
                return true;
            },
            //上传营业执照之前校验
            checkImg(){
                //============验证码==================
                if(this.userInfo.verificationCode == ''){
                    this.$toast('验证码不能为空');
                    return false;
                } 
                //============企业地址==================
                else if (this.userInfo.address == '') {
                    this.$toast('企业地址不能为空');
                    return false;
                };
            },
            save(){
                let that = this;
                if(that.isBtns){
                    return
                };
                that.isBtns=true;
                var reg = /^[a-zA-Z0-9_]{5,16}$/
                var reg2 = /^\d+?.*$/
                let vegCN = /[\u4e00-\u9fa5]/ig
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig

                if(this.checkYzm() == false){
                    that.isBtns=false;
                    return false
                };

                if(this.checkImg() == false) {
                    that.isBtns=false;
                    return false
                };

                
                console.log(that.userInfo,JSON.stringify(that.userInfo));
                this.$post('/sharePlatform-auth/auth/guest/register',{
                    companyName:that.userInfo.companyName,
                    mobile:that.userInfo.mobile,
                    address:that.userInfo.address,
                    userName:that.userInfo.userName,
                    password:that.userInfo.userPassword,
                    verificationCode:that.userInfo.verificationCode,//验证码
                    businessLicense:that.userInfo.businessLicense//营业执照
                },{
                }).then(function (res) {
                    if(res.code === 'I1-00-001'){
                        that.$toast('注册成功');
                        that.$router.push('/')
                    }else{
                        that.$toast(res.msg)
                        that.isBtns=false;
                        // that.reset()
                    }
                })
            },
            checkCompanyName(){
                let that = this;
                if(!that.userInfo.userName){
                    that.$toast('用户名不能为空')
                    return false;
                }
                this.$post('/sharePlatform-auth/auth/guest/vertifyUserName',{
                    userName:that.userInfo.userName
                }).then(res =>{
                    if(res.code === 'W3-01-0006'){

                    }else{
                        that.userInfo.userName = ''
                        that.$toast(res.msg)
                    }
                })

            },
            checkMobile(e){
                if(this.userInfo.mobile == '0'){
                    this.userInfo.mobile = ''
                }
                this.userInfo.mobile = this.userInfo.mobile.replace(/\D/g,'')
                // this.value=this.value.replace(/\D/g,'')
            }
        },
        watch:{
            mobile(newValue,oldValue){
                this.mobile = newValue.replace(/\D/g,'')
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .loading {
        text-align:center;color:#1989fa;position: absolute;left: 0;right: 0;line-height: 40px;
        padding-top: 6rem;
        div {
            margin: 0 auto;
        }
    }
    $color:red;
    $color:#27a9ff;
    .content{
        padding:1rem 0rem 2rem;position: absolute;top: 40px;bottom: 0;left: 0;right: 0;overflow: auto;
        //获取验证码按钮
        .van-button--plain.van-button--info {
            width: 84px;
            color: $color;
            border: 1px solid $color;
        }
        // 上传营业执照
        .demo-uploader{
            .van-uploader__upload {
                position: relative;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                -webkit-flex-direction: column;
                flex-direction: column;
                -webkit-box-align: center;
                -webkit-align-items: center;
                align-items: center;
                -webkit-box-pack: center;
                -webkit-justify-content: center;
                justify-content: center;
                box-sizing: border-box;
                width: 80px;
                height: 80px;
                margin: 8px 8px 8px 0;
                background-color: #fff;
                border: 1px dashed #e5e5e5;
                background-size: 100% 100%;
            }
        } 
    }
    // 保存重置按钮
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

