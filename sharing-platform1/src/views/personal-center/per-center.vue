<template>
    <div>
        <mt-header title="我的账户" style="z-index: 999;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <div class="content">
            <van-list :finished="true" finished-text="">
                <van-cell title="账户积分" is-link icon="balance-o" @click="$router.push('/index/integralDetails')">
                </van-cell>
                <van-cell title="我的收入" is-link icon="refund-o" @click="$router.push('/index/subCommission')">
                </van-cell>
                <van-cell v-if="userRole == 0" title="企业信息" is-link icon="apps-o" @click="$router.push({ path: '/information', query: { url: '/index/per-center' }})">
                    <span class="van-field__error-message" :class="reasonType">{{reason}}</span>
                </van-cell>
                <van-cell v-if="userRole == 0" title="开户信息" is-link icon="manager-o" @click="goRealNameAuthentication()">
                    <span class="van-field__error-message" :class="auditStatusClass">{{auditStatusMsg}}</span>
                </van-cell>
                <van-cell v-if="userRole == 0" title="收款账号" is-link icon="cash-back-record"
                    @click="goReceivables()">
                    <span class="van-field__error-message" :class="bankStatus">{{bankStatusMsg}}</span>
                </van-cell>
                <van-cell title="账户与安全" is-link icon="manager-o" @click="$router.push('/index/accountSecurity')">
                </van-cell>
            </van-list>
        </div>
        <section class="loading" v-show="loadingimg">
            <!-- <van-loading type="spinner" color="#1989fa" /> -->
            <van-loading type="spinner" color="#1989fa" vertical></van-loading>
            <div>加载中...</div>
        </section>
    </div>
</template>

<script>
    import { Field,Dialog,Uploader,Loading } from 'vant';
    export default {
        name: "per-center",
        data () {
            return {
                loadingimg: false,
                //审核状态 0:未上传执照，待审核，1:审核通过，2:审核未通过，3：已上传执照，审核中
                approvalStatus:0,
                reasonType:'error',
                reason:'',//审核状态
                userRole:0,  //(账号类型)  0：公司账号，1管家账号
                auditStatus:'0',
                auditStatusClass:'error',
                auditStatusMsg:'',
                bankStatus:'error',
                bankStatusMsg:'',
                disableGoReceivables:true,
                approvalStatus:'',
                reason:''
            }
        },
        mounted () {
            this.$postwc('/sharePlatform-auth/auth/getUserCheckStatus',{}).then(res => {
                if(res.code = 'I1-00-001'){
                    let userInfor = {
                        approvalStatus:res.data.approvalStatus, //(审核状态)    0:未上传执照，待审核，1:审核通过，2:审核未通过，3：已上传执照，审核中
                        userRole:res.data.userRole,             //(账号类型)     0：公司账号，1管家账号
                        auditStatus:res.data.auditStatus,       //(实名认证状态)  0-未进行认证  1-审核中 2-审核通过 3-审核失败
                        mobile:res.data.mobile
                    };
                    sessionStorage.setItem('userInfor',JSON.stringify(userInfor));
                    sessionStorage.setItem('merType',res.data.merType);
                    if(userInfor.approvalStatus){
                        this.approvalStatus = userInfor.approvalStatus;
                        //审核状态通过，信息不可修改
                        if(this.approvalStatus == 0) this.reason = '（未上传营业执照）';
                        if(this.approvalStatus == 2) this.reason = '（审核未通过）';
                        if(this.approvalStatus == 3) this.reason = '（审核中）';
                        if(this.approvalStatus == 1){
                            this.reasonType = 'success'
                            this.reason = '（审核通过）';
                        };
                    };
                    if(userInfor.userRole){
                        this.userRole = userInfor.userRole;
                    };
                    if(userInfor.auditStatus){
                        this.auditStatus = userInfor.auditStatus;
                        if(this.auditStatus == "0"){
                            this.auditStatusMsg = "（未认证）"
                        }
                        if(this.auditStatus == "1"){
                            this.auditStatusMsg = "（审核中）"
                        }
                        if(this.auditStatus == "2"){
                            this.auditStatusMsg = "（审核通过）";
                            this.auditStatusClass = "success";
                        }
                        if(this.auditStatus == "3"){
                            this.auditStatusMsg = "（审核驳回）"
                        }
                        if(this.auditStatus != "2"){
                            this.disableGoReceivables = false;
                        }
                    }
                }
            });
            let params = {};
            let url = '/sharePlatform-auth/accountSafe/queryPhoneByAccount';
            this.$postwc(url,params).then(res => {
                if(res.status == 0){
                    sessionStorage.setItem('bmsUserId',res.data.bmsUserId);
                    // sessionStorage.setItem('mobile',res.data.mobile);
                }
            });
            pushHistory();
            this.gotoURL(function () {
                pushHistory();
                this.$router.push('/index');
            })
        },
        methods:{
            goBack(){
                //this.$router.back(-1);
                this.$router.push('/index');
                // var url = this.$route.query.url;
                // this.$router.push(url);
            },
            goReceivables(){
                if(this.backOtherOrder() == false) return false;
                if(this.disableGoReceivables){
                    if(sessionStorage.getItem('mobile') == 'null'){
                        this.$toast('请先绑定手机号');
                        this.$router.push({path:'/index/per-center-mobile', query: {
                                'mobile':'',bmsUserId:sessionStorage.getItem('bmsUserId'),
                                url:'/index/per-center',
                                goUrl:'/index/m_enterBusiness'
                            }});
                    }else{
                        if(sessionStorage.getItem('merType')=='2'){
                            this.$router.push({path:'/index/m_receivables',query:{url:'/index/per-center'}});
                        }else if(sessionStorage.getItem('merType')=='3'){
                            this.$router.push({path:'/index/m_enterBusiness',query:{url:'/index/per-center'}});
                        }
                    }
                }else{
                    this.$toast('需先完成开户审核，才可绑定收款账号');
                    return false;
                }
            },
            goRealNameAuthentication(){
                if(this.backOtherOrder() == false) return false;
                this.$router.push({ path: '/index/realNameAuthentication', query: { url: '/index/per-center' }})
            },
            backOtherOrder () {
                let boolen = false;
                let that =  this;
                if(that.approvalStatus == 1){
                    //that.$router.push({ path: '/information', query: { url: '/index/per-center' }});
                    boolen = true;
                }
                if(that.approvalStatus == 0){
                    Dialog.confirm({
                        title: '',
                        message: '您需完善企业信息并通过审核后，才可进行本操作',
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        that.$router.push({ path: '/information', query: { url: '/index/per-center' }});
                    }).catch(() => {
                        //that.isBtns=false;
                    });
                }
                if(that.approvalStatus == 2){
                    Dialog.confirm({
                        title: '',
                        message: '企业注册信息被驳回，请修改信息并通过审核后，才可进行本操作\n 驳回原因：' + that.reason,
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        that.$router.push({ path: '/information', query: { url: '/index/per-center' }});
                    }).catch(() => {
                        //that.isBtns=false;
                    });
                }
                if(that.approvalStatus == 3){
                    this.$toast('已上传执照，审核中，请耐心等待');
                }
                return boolen;
            },
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
    .van-cell:after {
        content: ' ';
        position: absolute;
        pointer-events: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        left: 15px;
        right: 0;
        bottom: 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        border-bottom: 1px solid #ebedf0;
    }
</style>
