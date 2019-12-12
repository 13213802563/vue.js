<template>
    <div>
        <mt-header title="修改密码" style="z-index: 999;">
            <mt-button icon="back" @click="$router.push('/index/accountSecurity')" slot="left">返回</mt-button>
        </mt-header>
        <div class="content">
            <van-cell-group >
                <!-- <van-field v-model="userInfo.userName" required clearable label="账号:" placeholder="请输入账号" error-message="" maxlength="16"/> -->
                <van-field v-model="userInfo.oldPassword" required clearable type="password" label="旧密码:" placeholder="请输入旧密码" maxlength="16"/>
                <van-field v-model="userInfo.newPassword" required clearable type="password" label="新密码:" placeholder="请输入新密码" maxlength="16"/>
                <van-field v-model="userInfo.nextPassword" required clearable type="password" label="确认密码:" placeholder="请再次输入密码" error-message="" maxlength="16"/>
                <!-- <van-field v-model="userInfo.mobile" required clearable label="手机号:" placeholder="请输入手机号" error-message="" maxlength="11"/>
                <van-field required clearable v-model="userInfo.verificationCode" center label="验证码:" placeholder="请输入短信验证码" maxlength="6">
                    <van-button slot="button" plain size="small" type="info" :disabled="timeBtn" @click="getYzm" ref="time">{{time}}</van-button>
                </van-field> -->
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
    import { Loading } from 'vant';
    export default {
        name: "passWordEdit",
        data () {
            return {
                userInfo:{
                    userName:'f-11111',    //填写默认值，跳过验证
                    mobile:'18636590277',  //填写默认值，跳过验证
                    oldPassword:'',
                    newPassword:'',
                    nextPassword:'',
                    verificationCode:'123123',//验证码  //填写默认值，跳过验证
                },
                loadingimg: false,
                time:'获取验证码',
                timeBtn:false,
                isBtns:false  //防止保存按钮重复点击
            }
        },
        methods:{
            reset(){
                for(let key in this.userInfo){
                    if(this.userInfo.hasOwnProperty(key)){
                        this.userInfo[key] = ''
                    }
                };
                this.userInfo.userName = 'f-11111'    //跳过账号验证
                this.userInfo.mobile = '18636590277'  //跳过手机号验证
                this.userInfo.verificationCode = '123123'//跳过验证码验证
            },
            save(){
                let that = this;

                //获取验证码之前的部分做校验
                if(this.checkYzm() == false){
                    return false
                };

                //============验证码==================
                if(this.userInfo.verificationCode == ''){
                    this.$toast('验证码不能为空');
                    return false;
                } 

                if(that.isBtns){ return false };
                that.isBtns=true;

                this.$postwc('/sharePlatform-auth/accountSafe/changePassword',{
                    oldPassword:that.userInfo.oldPassword,
                    newPassword:that.userInfo.newPassword,
                    //mobile:that.userInfo.mobile,
                    //code:that.userInfo.verificationCode,//验证码
                }).then(function (res) {
                    if(res.code === 'I1-00-001'){
                        that.$toast('密码修改成功，请重新登录');
                        that.isBtns=false;
                        that.bdMobile = true;
                        that.$router.push('/');
                    }else{
                        that.$toast(res.msg)
                        that.isBtns=false;
                    }
                })
            },
            //获取验证码之前的部分做校验
            checkYzm(){
                let that = this;
                var reg = /^[a-zA-Z0-9_]{5,16}$/
                var reg2 = /^\d+?.*$/
                let vegCN = /[\u4e00-\u9fa5]/ig
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;

                let regUserName = /^[a-zA-Z0-9_-]{5,16}$/;

                //==========账号===============
                if (this.userInfo.userName == '') {
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
                
                //==========旧密码================
                else if (this.userInfo.oldPassword == '') {
                    that.$toast('旧密码不能为空');
                    return false;
                }
                //===========新密码===============
                else if (this.userInfo.newPassword == '') {
                    that.$toast('新密码不能为空');
                    return false;
                }
                else if (reg2.test(this.userInfo.newPassword)) {
                    that.$toast('新密码不能以数字开头');
                    return false;
                }
                else if (!regUserName.test(this.userInfo.newPassword)) {
                    that.$toast('新密码只能是字母、数字、下划线，且长度最短为5位，长度最长为16位');
                    return false;
                } 
                 //==========再次输入密码================
                else if (this.userInfo.nextPassword == '') {
                    that.$toast('请再次输入密码');
                    return false;
                }
                else if (this.userInfo.nextPassword != this.userInfo.newPassword) {
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
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .content{
        padding:1rem 0rem 2rem;position: absolute;top: 40px;bottom: 0;left: 0;right: 0;overflow: auto;
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
