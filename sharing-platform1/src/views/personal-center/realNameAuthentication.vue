<template>
    <div>
        <mt-header title="开户信息" style="z-index: 999;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <van-notice-bar  :text="auditStatusMsg" left-icon="volume-o"/>
        <div class="content">
            <div style="padding: 10px 15px;color: #323233;font-size: 14px;line-height: 24px;">基本信息:</div>
            <van-cell-group>
                <van-field v-model="userInfo.merName" clearable required :disabled="disableForm" label="商户名称:" placeholder="请填写营业执照上的商户名称" error-message="" maxlength="50"/>
                <van-field v-model="userInfo.merBusinessAliasName" clearable required :disabled="disableForm" label="业务别名:" placeholder="如：店铺名称等" error-message="" maxlength="50"/>
                <div class="van-cell van-cell--required van-field my--required-radio">
                    <div class="van-cell__title van-field__label" style="display:flex;align-items:center;">
                        <span>证件类型:</span>
                    </div>
                    <div class="van-cell__value" style="text-align:left;">
                        <van-radio-group v-model="userInfo.certType" :disabled="disableForm" @change="changeCertType">
                            <van-radio name="1">营业执照</van-radio>
                            <van-radio name="2">统一社会信用代码</van-radio>
                        </van-radio-group>
                    </div>
                </div>
                <van-field v-model="userInfo.certId" clearable required  :disabled="disableForm" label="证件号码:" placeholder="请输入证件号码" error-message="" :maxlength="certIdLength"/>
                <van-field v-model="userInfo.legalName" clearable required :disabled="disableForm" label="法人姓名:" placeholder="请输入法人姓名" error-message="" maxlength="10"/>
                <van-field v-model="userInfo.identityId" clearable required :disabled="disableForm" label="法人身份证号:" placeholder="请输入法人身份证号" error-message="" maxlength="18"/>
                <van-field v-model="userInfo.contactsName" clearable required :disabled="disableForm" label="联系人姓名:" placeholder="请输入联系人姓名" error-message="" maxlength="10"/>
                <van-field v-model="userInfo.mobile" clearable required :disabled="disableForm" label="联系人手机号:" placeholder="请输入联系人手机号" error-message="" maxlength="11"/>
            </van-cell-group>

            <div style="padding: 10px 15px;color: #323233;font-size: 14px;line-height: 24px;">资质文件:</div>
            <van-cell-group>
                <div class="van-cell van-cell--required van-field my--required-radio">
                    <div class="van-cell__title van-field__label" style="display:flex;align-items:center;">
                        <span>商户类型:</span>
                    </div>
                    <div class="van-cell__value" style="text-align:left;">
                        <van-radio-group v-model="userInfo.merType" :disabled="disableForm">
                            <van-radio name="3">企业商户</van-radio>
                            <van-radio name="2">个体商户</van-radio>
                        </van-radio-group>
                    </div>
                </div>
                <div class="van-cell van-cell--required van-field my--required">
                    <div class="van-cell__title van-field__label" style="display:flex;align-items:center;">
                        <span>营业执照:</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                            <div class="demo-uploader">
                                <div class="van-uploader">
                                    <div class="van-uploader__wrapper">
                                        <div class="van-uploader__upload" :style="{'background-image':'url(' + userInfo.bussinessLicenseImgUrl +')'}">
                                            <i class="van-icon van-icon-plus van-uploader__upload-icon" v-if="userInfo.bussinessLicenseImgUrl == ''"></i>
                                            <input @change="changeBussinessLicense" type="file" :disabled="disableForm" class="van-uploader__input" ref="inputer" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="van-cell van-cell--required van-field my--required" v-if="userInfo.merType == '3'">
                    <div class="van-cell__title van-field__label" style="display:flex;align-items:center;">
                        <span>开户许可证:</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                            <div class="demo-uploader">
                                <div class="van-uploader">
                                    <div class="van-uploader__wrapper">
                                        <div class="van-uploader__upload" :style="{'background-image':'url(' + userInfo.bankAccountLicenceImgUrl +')'}">
                                            <i class="van-icon van-icon-plus van-uploader__upload-icon" v-if="userInfo.bankAccountLicenceImgUrl == ''"></i>
                                            <input @change="changeBankAccountLicence" type="file" :disabled="disableForm" class="van-uploader__input" ref="inputer" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="van-cell van-cell--required van-field my--required">
                    <div class="van-cell__title van-field__label" style="display:flex;align-items:center;">
                        <span>法人身份证:</span>
                    </div>
                    <div class="van-cell__value">
                        <div class="van-field__body">
                            <div class="demo-uploader">
                                <div class="van-uploader">
                                    <div class="van-uploader__wrapper">
                                        <div class="van-uploader__upload" :style="{'background-image':'url(' + userInfo.idCardBackImgUrl +')'}">
                                            <i class="van-icon van-uploader__upload-icon" v-if="userInfo.idCardBackImgUrl == ''">上传人像面</i>
                                            <input @change="changeIdCardBack" type="file" :disabled="disableForm" class="van-uploader__input" ref="inputer" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="demo-uploader">
                                <div class="van-uploader">
                                    <div class="van-uploader__wrapper">
                                        <div class="van-uploader__upload" :style="{'background-image':'url(' + userInfo.idCardFrontImgUrl +')'}">
                                            <i class="van-icon van-uploader__upload-icon" v-if="userInfo.idCardFrontImgUrl == ''">上传国徽面</i>
                                            <input @change="changeIdCardFront" type="file" :disabled="disableForm" class="van-uploader__input" ref="inputer" accept="image/*">
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
            <div class="g-buttons" v-if="!disableForm">
                <!-- <button @click="reset" type="primary" size="large">重置</button> -->
                <button @click="save" type="primary" size="large" :disabled="isBtns" style="margin-top: 1rem">提交审核</button>
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
                userInfo:{
                    merName:'',
                    merBusinessAliasName:'',
                    certType:"1", //证件类型(1-营业执照,2-统一社会信用代码)
                    certId:'',
                    legalName:'',
                    identityId:'',
                    contactsName:'',
                    mobile:'',
                    merType:"3",//商户类型(2-个体工商户,3-企业商户)
                    bussinessLicenseImgUrl:'',//营业执照
                    bankAccountLicenceImgUrl:'',//开户许可证
                    idCardBackImgUrl:'',//法人身份证人像面
                    idCardFrontImgUrl:'',//法人身份证国徽面
                },
                certIdLength: 15,
                disableBussinessLicense:false,// true时禁用营业执照
                loadingimg: false,
                time:'获取验证码',
                timeBtn:false,
                isBtns:false,  //防止保存按钮重复点击
                msg:'',//msg不为空时，显示子账号权限不足
                disableForm:true,//禁用表单,

                ////(实名认证状态)  0-未进行认证  1-审核中 2-审核通过 3-审核失败
                auditStatus:"0",
                auditStatusMsg:'请完善开户信息，以便提现',
                reasonType:'error',
                reason:'',//审核驳回原因


            }
        },
        created () {
            let params = {};
            let url = '/sharePlatform-order/accountPay/queryAccountInfo';
            this.$postwc(url,params).then(res => {
                if(res.code = "I1-00-001"){
                    this.userInfo = res.data;
                    this.userInfo.certType = '' + res.data.certType;
                    this.userInfo.merType = '' + res.data.merType;
                    this.auditStatus = res.data.auditStatus;
                    if(this.auditStatus == "0"){
                        this.auditStatusMsg = "请完善开户信息，以便提现";
                        this.disableForm = false;
                    }else if(this.auditStatus == "1"){
                        this.auditStatusMsg = "已提交开户审核，请耐心等待审核通过";
                    }else if(this.auditStatus == "2"){
                        this.auditStatusMsg ="开户信息审核通过";
                    }else if(this.auditStatus == "3"){
                        this.auditStatusMsg ="开户信息审核被驳回，驳回原因："+ res.data.auditAdvice +"，请修改信息";
                        this.disableForm = false;
                    }
                }
            });
            this.$postwc('/sharePlatform-auth/auth/getUserCheckStatus',{}).then(res => {
                sessionStorage.setItem('merType',res.data.merType);
                if(res.code = 'I1-00-001'){
                    if(res.data.approvalStatus){
                        if(res.data.approvalStatus == 1){
                            //this.disableBussinessLicense = true;
                        };
                    };
                }
            });
        },
        methods:{
            goBack(){
                //this.$router.back(-1);
                var url = this.$route.query.url;
                this.$router.push(url);
            },
            //change事件 选择营业执照后
            changeBussinessLicense(e){
                this.changeIdCard(e,'bussinessLicenseImgUrl');
            },
            changeBankAccountLicence(e){
                this.changeIdCard(e,'bankAccountLicenceImgUrl');
            },
            changeIdCardBack(e){
                this.changeIdCard(e,'idCardBackImgUrl');
            },
            changeIdCardFront(e){
                this.changeIdCard(e,'idCardFrontImgUrl');
            },
            changeIdCard(e,key){
                console.log(e,key);
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
                        this.userInfo[key] = res.reUrl[0];
                    }else{
                        this.$toast('网络延迟，请稍后再试')
                    };

                }).catch(function (error) {
                    this.loadingimg = false;
                    console.log(error);
                });
            },
            changeCertType(){
                if(this.userInfo.certType == "1"){
                    this.certIdLength = 15
                }else{
                    this.certIdLength = 18
                }
            },
            checkForm(){
                if(this.userInfo.merName == ''){
                    this.$toast('商户名称不能为空');
                    return false;
                };
                if(this.userInfo.merBusinessAliasName == ''){
                    this.$toast('业务别名不能为空');
                    return false;
                };
                if(this.userInfo.certId == ''){
                    this.$toast('证件号码不能为空');
                    return false;
                };
                if(this.userInfo.certType == "1"){
                    if(this.userInfo.certId.length != 15){
                        this.$toast('营业执照只能是数字或字母且长度为15位');
                        return false;
                    }
                    if(!(/^[0-9\a-zA-Z\/]{15}$/).test(this.userInfo.certId)){
                        this.$toast('营业执照只能是数字或字母且长度为15位');
                        return false;
                    };
                }else{
                    if(!(/^[0-9\a-zA-Z\/]{18}$/).test(this.userInfo.certId)){
                        this.$toast('同统一社会信用代码只能是数字或字母且长度为18位');
                        return false;
                    };
                };

                //============法人===================
                let name = /^[\u4E00-\u9FA5\uf900-\ufa2d·s\/ ]{2,20}$/;  //中文 英文 至少为两位，最多三为
                if(this.userInfo.legalName == ''){
                    this.$toast('法人姓名不能为空');
                    return false;
                };
                if(!name.test(this.userInfo.legalName)){
                    this.$toast('法人姓名不合法吗，只能是中文姓名');
                    return false;
                };
                //============法人身份证================
                if(this.userInfo.identityId == ''){
                    this.$toast('法人身份证号不能为空');
                    return false;
                };
                //检验身份证年龄在22-55岁之前
                // var cardId = identityId;
                // var curYear = new Date().getFullYear()
                // var curAge =  curYear - parseFloat(cardId.split('')[6]+cardId.split('')[7]+cardId.split('')[8]+cardId.split('')[9]);
                // if(curAge<21 && curAge<56){
                //     var test = '年龄超出范围';
                // }else{
                //     var test = '年龄超出范围';
                // }
                if(!(/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(this.userInfo.identityId))) {
                    this.$toast("法人身份证号有误");
                    return false;
                };
                //===========联系人姓名=============================
                if(this.userInfo.contactsName == ''){
                    this.$toast('联系人姓名不能为空');
                    return false;
                };
                if(!name.test(this.userInfo.contactsName)){
                    this.$toast('联系人姓名不合法，只能是中文姓名');
                    return false;
                };
                //============手机===================
                let mobileReg = /0?(13|14|15|18|16|17|18|19)[0-9]{9}/ig;
                if (this.userInfo.mobile == '') {
                    this.$toast('联系人手机号不能为空');
                    return false;
                }else if(!mobileReg.test(this.userInfo.mobile)){
                    this.$toast('联系人手机号不合法')
                    return false;
                };

                if (this.userInfo.bussinessLicenseImgUrl == '') {
                    this.$toast('营业执照不能为空');
                    return false;
                };
                if(this.userInfo.merType == "3"){
                    if (this.userInfo.bankAccountLicenceImgUrl == '') {
                        this.$toast('开户许可证不能为空');
                        return false;
                    };
                };

                if (this.userInfo.idCardBackImgUrl == '') {
                    this.$toast('法人身份证人像面不能为空');
                    return false;
                };
                if (this.userInfo.idCardFrontImgUrl == '') {
                    this.$toast('法人身份证国徽面不能为空');
                    return false;
                };

                return true;
            },
            save(){
                if(this.disableForm){
                    this.$toast(this.auditStatusMsg);
                    return false;
                }

                if(this.checkForm() == false) return false;

                if(this.isBtns){ return false };
                this.isBtns=true;

                this.$postwc('/sharePlatform-order/accountPay/insertAccountInfo',{
                    merName:this.userInfo.merName.trim(),
                    merBusinessAliasName:this.userInfo.merBusinessAliasName.trim(),
                    certType:this.userInfo.certType, //证件类型(1-营业执照,2-统一社会信用代码)
                    certId:this.userInfo.certId.trim(),
                    legalName:this.userInfo.legalName.trim(),
                    identityId:this.userInfo.identityId.trim(),
                    contactsName:this.userInfo.contactsName.trim(),
                    mobile:(this.userInfo.mobile + '').trim(),
                    merType:this.userInfo.merType,
                    bussinessLicenseImgUrl:this.userInfo.bussinessLicenseImgUrl,//营业执照
                    bankAccountLicenceImgUrl:this.userInfo.bankAccountLicenceImgUrl,//开户许可证
                    idCardBackImgUrl:this.userInfo.idCardBackImgUrl,//法人身份证人像面
                    idCardFrontImgUrl:this.userInfo.idCardFrontImgUrl,//法人身份证国徽面
                }).then((res) => {
                    if(res.code === 'I1-00-001'){
                        this.$toast('已提交开户审核，请耐心等待审核通过');
                        this.isBtns=false;
                        this.goBack();
                    }else{
                        this.$toast(res.msg)
                        this.isBtns=false;
                        // this.reset()
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
        padding:0rem 0rem 2rem;position: absolute;top: 88px;bottom: 0;left: 0;right: 0;overflow: auto;
        .success{color:#07c160;}
    }
    .loading {
        text-align:center;color:#1989fa;position: absolute;left: 0;right: 0;line-height: 40px;
        padding-top: 6rem;
        div {
            margin: 0 auto;
        }
    }
    .van-divider {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        margin: 16px 0;
        color: #969799;
        font-size: 14px;
        line-height: 24px;
        border-color: #ebedf0;
        border-style: solid;
        border-width: 0;
    }
    .van-divider::before, .van-divider::after {
        display: block;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        box-sizing: border-box;
        height: 1px;
        border-color: inherit;
        border-style: inherit;
        border-width: 1px 0 0;
    }
    .van-divider::before {
        content: '';
    }
    .van-divider--hairline::before, .van-divider--hairline::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .van-divider--content-center::before, .van-divider--content-left::before, .van-divider--content-right::before {
        margin-right: 16px;
    }
    .van-divider--content-left::before {
        max-width: 10%;
    }
    .van-divider--content-center::after, .van-divider--content-left::after, .van-divider--content-right::after {
        margin-left: 16px;
        content: '';
    }
    .my--required::before {
        line-height: 96px;
    }
    .my--required-radio::before{
        line-height: 48px;
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
            width: 110px;
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
