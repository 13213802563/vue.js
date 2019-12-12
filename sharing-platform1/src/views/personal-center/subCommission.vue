<template>
    <div>
        <mt-header title="我的收入" style="z-index: 999;width:100%;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
            <router-link to="/index/subCommission/record" slot="right">
                <mt-button>收支记录</mt-button>
            </router-link>
        </mt-header>
        <div class="money">
            <!--v-if="role=== '1' && userList.length!=0"-->
            <span style="width:70%;display: inline-block">可提现收入：{{balance}}</span>
            <span style="text-align: right" @click="getBankInf" v-if="userRole == 0">
                <van-button plain hairline type="info" style="height:30px;line-height: 30px">提现</van-button>
            </span>
        </div>
        <van-cell>
            <van-row>
                <van-col span="12">
                    <div style="text-align:center;">预计收入 ￥{{totalAmount}}</div>
                </van-col>
                <van-col span="12">
                    <div style="text-align:center;">累计收入 ￥{{incomeMoneys}}</div>
                </van-col>
            </van-row>
        </van-cell>
        <div>
            <div class="month" v-show="!isMonthShow">
                <span>{{singleMonth}}月</span>
            </div>
        </div>
        <div class="main">
            <div class="listScroll" v-show="!loadingimg">
                <div v-if="userList.length > 0" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="50" >
                    <template>
                        <div class="listBox item" v-for="(score,index) in userList" :key="index">
                            <h4 class="titleType">{{score.payKind}}</h4>
                            <p>
                                <span class="creatTime" style="color:#ccc;">订单号：{{ score.orderCode }}</span>
                                <span class="status">收入</span>
                                <span class="integral">+{{score.amount}}</span>
                            </p>
                            <p  v-if="role == '1'" style="margin-bottom: 0.5rem;color:#ccc;">管家账号：{{score.sourceUserId}}</p>
                            <p>{{score.createTime}}</p>
                        </div>
                    </template>
                </div>
                <div class="no-list" v-if="noData">
                    <img src="../../assets/no-data.png" alt="" style="width:100%">
                </div>
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
    </div>
</template>

<script>
    import {Loading,Button,Dialog} from 'vant';
    export default {
        name: "subCommission",
        data(){
            return {
                role:'1',
                noData:true,
                currentPage:0,
                userList:[],
                loading: false,
                allPage: false,
                onScroll:false,
                loadingimg: false,
                totalAmount:0.00,
                balance:0.00,
                incomeMoneys:0.00,
                month:[],
                singleMonth:0,
                isMonthShow:true,
                userRole:1,
                approvalStatus:'',
                reason:''
            }
        },
        components: {
            [Loading.name]: Loading
        },
        mounted() {
            this.loadMore();

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

                    this.userRole = res.data.userRole;
                    this.approvalStatus = res.data.approvalStatus;
                    this.reason = res.data.reason;
                }
            });
            let self = this;
            this.gotoURL(function () {
                pushHistory();
                self.$router.push('/index/per-center');
            })
        },
        methods:{
            backOtherOrder () {
                let boolen = false;
                let that =  this;
                if(that.approvalStatus == 1){
                    //that.$router.push({ path: '/information', query: { url: '/index/subCommission' }});
                    boolen = true;
                }
                if(that.approvalStatus == 0){
                    Dialog.confirm({
                        title: '',
                        message: '您需完善企业信息并通过审核后，才可进行本操作',
                        confirmButtonText:'去完善信息'
                    }).then(() => {
                        that.$router.push({ path: '/information', query: { url: '/index/subCommission' }});
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
                        that.$router.push({ path: '/information', query: { url: '/index/subCommission' }});
                    }).catch(() => {
                        //that.isBtns=false;
                    });
                }
                if(that.approvalStatus == 3){
                    this.$toast('已上传执照，审核中，请耐心等待');
                }
                return boolen;
            },
            loadMore(){
                let that = this;
                that.loading = true
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$postwc('/sharePlatform-order/accountPay/findshareMoneyList',{
                        pageNum:that.currentPage,
                        pageSize:10,
                    }).then(res => {
                        if(res.code == "E1-00-001") return false;
                        if(res.code == "W2-00-001"){
                            this.noData=true;
                            return false
                        }
                        that.loadingimg = false;
                        that.noData=false;
                        that.totalAmount = res.data.totalAmount;
                        if(!!that.totalAmount == false) that.totalAmount = '0.00';

                        that.incomeMoneys = res.data.incomeMoneys;
                        that.balance = res.data.balance;
                        if(!!that.balance == false) that.balance = '0.00';
                        sessionStorage.setItem('balance',that.balance);
                        if(res.data.data == null) return false;
                        that.userList = that.userList.concat(res.data.data.list);

                        that.role = that.userList[0].role;
                        that.loading = false;
                        that.singleMonth = res.data.data.list[0].createTime.slice(5,7);
                        that.isMonthShow= this.singleMonth == 0 ? true : false;
                        if(that.currentPage === res.data.data.pages){
                            that.onScroll = true;
                        }else {
                            that.onScroll = false;
                        }
                    })
                },300)
            },
            getBankInf(){
                if(this.backOtherOrder() == false) return false;
                if(this.balance <= 0  || !!this.balance == false){
                    this.$toast('无可提现收入');
                    return false;
                };
                if(JSON.parse(sessionStorage.getItem('userInfor')).auditStatus == 2){
                    if(sessionStorage.getItem('mobile') != 'null'){
                        if(sessionStorage.getItem('merType')=='2'){
                            this.$router.push({path:'/index/m_receivables',query:{url:'/index/subCommission'}});
                        }else if(sessionStorage.getItem('merType')=='3'){
                            this.$router.push({path:'/index/m_enterBusiness',query:{url:'/index/subCommission'}});
                        }
                    }else{
                        this.$toast('请先绑定手机号');
                        this.$router.push({path:'/index/per-center-mobile', query: {
                            'mobile':'',
                            bmsUserId:sessionStorage.getItem('bmsUserId'),
                            url:'/index/subCommission',
                            goUrl:'/index/m_receivables'
                        }});
                    }
                }else{
                    this.$toast('需先完成开户审核，才可绑定收款账号');
                    //this.$router.push({ path: '/index/realNameAuthentication', query: { url: '/index/per-center' }});
                }

            },
            goBack(){
                if( this.$route.query.type== 5){
                    this.$router.push({
                        path: 'orderManagerment',
                        query: {val:2}
                    })
                }else if( this.$route.query.type== 'subServicing'){
                    this.$router.push('/index/servicerManagerment?active=2')
                }
                else{
                    this.$router.push('/index/per-center')
                }
            }
        },

    }
</script>

<style scoped lang="scss">
    .el-button{
        text-align: left !important;
    }
    .title{
        text-align: center;
        display: initial;
        color: white;
        margin-left:35%;
    }
    .el-header{
        padding:0 !important;
        background-color: rgba(38, 162, 255, 1);
        color: #333;
        text-align: left;
        line-height: 60px;
    }
    .el-button--text{
        color:white;
    }

    .money{
        width:100%;
        background-color: #4A3535;
        padding:1rem 1rem;
        color:white;
    }
    h2{
        color:white;
    }
    .month{
        width:100%;
        text-align: left;
        background-color: #efefef;
        padding:0;
        height: 2rem;
        span{
            display: inline-block;
            padding-left: 1rem;
            padding-top: 0.5rem;
        }
    }
    .listBox{
        box-shadow: 0px 1px 0px 0px  #f1f1f1;
        padding-bottom: 1rem;
        margin:1rem 1rem;
    }
    .creatTime{
        width:68%;
        margin-bottom:.5rem;
        text-align: left;
        display: inline-block;
    }
    .status{
        width:10%;
        margin-bottom:.5rem;
        display: inline-block;
    }
    .integral{
        width:22%;
        text-align: right;
        display: inline-block;
    }
    .titleType{
        text-align: left;
        margin-bottom: 1rem;
    }
    .no-list{
        padding: 4.0625rem 0.9375rem 0;
        text-align: center;
        font-size: 0.9375rem;
    }
    .no-list img{
        width: 16.25rem;
    }
    .listScroll{
        overflow: scroll;
        height: 80vh;
        position: fixed;
        left: 0;
        right: 0;
        padding-top:0;
        margin-bottom: 1rem;
    }

</style>
