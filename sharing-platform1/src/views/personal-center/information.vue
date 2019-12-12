<template>
    <div>
        <mt-header title="完善信息" style="z-index: 999;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <div class="content">
            <van-cell-group>
                <van-field v-model="userInfo.companyName" clearable disabled label="公司名称:" placeholder="请输入公司名称" error-message=""/>
                <van-field v-model="userInfo.userName" clearable disabled label="账号:" placeholder="请输入账号" error-message="" maxlength="16"/>
                <van-field v-model="userInfo.mobile" clearable disabled label="手机号:" placeholder="请输入手机号" error-message="" maxlength="11"/>
                <van-field v-model="userInfo.address" clearable disabled
                    type="textarea" autosize rows="1" label="企业地址:" placeholder="请输入企业地址" error-message="" />

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
                                            <input @change="changeIdCard1" type="file" :disabled="disableFile" class="van-uploader__input" ref="inputer" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="van-cell"  v-if="msg">
                    <div class="van-field__error-message">{{msg}}</div>
                </div>
                <div class="van-cell"  v-if="reason">
                    <div class="van-field__error-message" :class="reasonType">{{reason}}</div>
                </div>
            </van-cell-group>

            <div class="g-buttons" v-if="disableForm">
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
    import { Loading } from 'vant';
    export default {
        name: "information",
        data () {
            return {
                //用于重置输入框
                userInfo_bf:{
                    companyName:'测试',
                    mobile:'18636590279',
                    address:'北京市石景山万商大厦5层501',
                    userName:'bjceshijz',
                    yzm:'',
                },
                userInfo:{
                    companyName:'测试',
                    mobile:'18636590279',
                    address:'北京市石景山万商大厦5层501',
                    userName:'bjceshijz',
                    yzm:'',
                    businessLicense:''//营业执照
                },
                loadingimg: false,
                time:'获取验证码',
                timeBtn:false,
                isBtns:false,  //防止保存按钮重复点击
                msg:'',//msg不为空时，显示子账号权限不足
                disableForm:true,//false 子账号全权限不足隐藏保存重置按钮,
                disableFile:false,//true 子账号全权限不足禁用 file 选择图片

                //审核状态 0:未上传执照，待审核，1:审核通过，2:审核未通过，3：已上传执照，审核中
                approvalStatus:0,
                reasonType:'error',
                reason:''//审核驳回原因
            }
        },
        created () {
            //清空前台测试数据
            for(var key in this.userInfo){
                this.$set(this.userInfo,key,"");
                this.$set(this.userInfo_bf,key,"");
            };

            let params = {};
            let url = '/sharePlatform-auth/auth/getUserImproveInformation';
            this.$postwc(url,params).then(res => {
                for(var key in res.data){
                    if(res.data[key] == null){
                        res.data[key] ='';
                    }
                    this.$set(this.userInfo,key,res.data[key]);
                    this.$set(this.userInfo_bf,key,res.data[key]);
                }
                console.log(this.userInfo,this.userInfo_bf);
                if(res.status == 1){
                    this.msg = res.msg;
                    this.disableForm = false;
                    this.disableFile = true;
                    return false;
                }
            });

            this.$postwc('/sharePlatform-auth/auth/getUserCheckStatus',{
            }).then(res => {
                this.approvalStatus = res.data.approvalStatus;
                sessionStorage.setItem('merType',res.data.merType);
                //审核状态通过，信息不可修改
                if(this.approvalStatus == 1) {
                    this.disableForm = false; this.disableFile=true;
                    this.reasonType = 'success'
                    this.reason = '（审核通过：信息不可修改)';
                }
                if(this.approvalStatus == 0) this.reason = '（请上传营业执照)';
                if(this.approvalStatus == 2) this.reason = '（驳回原因：' + res.data.reason + ')';
                if(this.approvalStatus == 3) this.reason = '（审核中：您的企业信息正在审核中，请耐心等待)';
            })
        },
        methods:{
            goBack(){
                //this.$router.back(-1);
                var url = this.$route.query.url;
                this.$router.push(url);
            },
            //change事件 选择营业执照后
            changeIdCard1(e){
                let that = this;
                console.log(e.target.files[0])
                if(e.target.files[0] == undefined) return false;
                let size = e.target.files[0].size //图片的大小 MB  大小不超过10M
                if (size > 10*1024*1024) {
                    this.$toast('请选择10M以内的图片！');
                    return false;
                }
                this.loadingimg = true;
                this.$file(e.target.files[0]).then(res => {
                    //{"errMsg":"不允许上传的类型,只支持格式GIF、PNG、JPG!","recode":20006}
                    //{"reUrl":["https://static.dingtalk.com/media/lADPBE1XYe3XsC3NBP7NAk4_590_1278.jpg"],"recode":0}
                    console.log(res);
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
            //将输入框用户做的更改重置为更改之前的内容
            reset(){
                for(let key in this.userInfo){
                    if(this.userInfo.hasOwnProperty(key)){
                        this.userInfo[key] = this.userInfo_bf[key]
                    }
                };
                this.$refs.inputer.value = '';  //移除file内容
                this.userInfo.businessLicense = '';//清空预览图片
            },
            save(){
                let that = this;

                if (this.userInfo.businessLicense == '') {
                    that.$toast('营业执照不能为空');
                    return false;
                };

                if(that.isBtns){ return false };
                that.isBtns=true;

                this.$postwc('/sharePlatform-auth/auth/saveUserImproveInformation',{
                    companyName:that.userInfo.companyName,
                    businessLicense:that.userInfo.businessLicense//营业执照
                }).then(function (res) {
                    if(res.code === 'I1-00-001'){
                        that.$toast('完善成功');
                        that.isBtns=false;
                        that.goBack()
                    }else{
                        that.$toast(res.msg)
                        that.isBtns=false;
                        // that.reset()
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
    .content{
        padding:1rem 0rem 2rem;position: absolute;top: 40px;bottom: 0;left: 0;right: 0;overflow: auto;
        .success{color:#07c160;}
    }
    .loading {
        text-align:center;color:#1989fa;position: absolute;left: 0;right: 0;line-height: 40px;
        padding-top: 6rem;
        div {
            margin: 0 auto;
        }
    }
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
