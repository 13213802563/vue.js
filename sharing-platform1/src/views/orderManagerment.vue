<template>
    <div>
        <mt-header title="订单管理系统" style="z-index: 999;">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <router-link to="/index/orderManagerment/addOrder" slot="right">
                <mt-button>新增</mt-button>
            </router-link>
        </mt-header>
        <van-tabs v-model="active">
            <van-tab title="我的录入">
                <section style="z-index: 999;position: fixed;width:100%">
                    <form action="/">
                        <van-search
                                v-model="searchName"
                                placeholder="输入姓名、手机号、订单类型进行搜索"
                                maxlength="16"
                                show-action
                                @input="changeSearchName"
                                @search="onSearch"
                                @cancel="onCancel"
                                查看合同        @clear="clear"
                        >
                            <div slot="action" @click="onSearch">搜索</div>
                        </van-search>
                    </form>
                </section>
                <section class="tab" v-show="!loadingimg">
                    <div class="g-list" style="margin-top:3.8rem" v-if="orderlist.length > 0"  v-infinite-scroll="getOrderList" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <div class="item" v-for="(item, index) in orderlist" :key="index" @click="toDetails(item)">
                            <div class="part">
                                <span class="u-text-title">姓名：</span>
                                <span class="u-text-des">{{item.userName}}</span>
                            </div>
                            <div class="part" v-if="item.consumeCount == 0">
                                <span class="u-text-title">客户手机：</span>
                                <span class="u-text-des">{{item.userMobile}}</span>
                            </div>
                            <div class="part" v-if="item.consumeCount > 0">
                                <span class="u-text-title">管家手机：</span>
                                <span class="u-text-des" v-html="item.regionMobile == '' ? '--' : item.regionMobile"></span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">订单类型：</span>
                                <span class="u-text-des">{{item.orderTypeName}}</span>
                                <span class="u-text-title" style="margin-left: 1rem">状态：</span>
                                <span class="u-text-des">{{item.orderStatusName}}</span>
                            </div>
                            <div class="part" style="display: flex;">
                                <span class="u-text-title" style="min-width: 5rem;">客户地址：</span>
                                <span class="u-text-des">{{item.userAddress}}</span>
                            </div>
                            <div class="part" style="text-align: left;">
                                <button class="edit" @click.stop="updateOrder(item)">修改</button>
                            </div>
                        </div>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </section>
            </van-tab>
            <van-tab title="合单中">
            </van-tab>
            <van-tab title="已完成">
                <section class="tab" v-show="!loadingimg">
                    <div class="g-list" v-if="mergedOrder.length > 0"  v-infinite-scroll="mergedOrderList" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <div class="item" v-for="(item, index) in mergedOrder" :key="index">
                            <div class="part">
                                <span class="u-text-title">订单号：</span>
                                <span class="u-text-des">{{item.orderId }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">客户姓名：</span>
                                <span class="u-text-des">{{ item.userName }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">订单类型：</span>
                                <span class="u-text-des">{{ item.orderTypeName }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">客户地址：</span>
                                <span class="u-text-des">{{ item.userAddress }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">管家手机号：</span>
                                <span class="u-text-des">{{item.rechargeMobile }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">订单金额(元)：</span>
                                <span class="u-text-des">{{ item.totalPay }}</span>
                            </div>
                            <div class="part" style="text-align: left;">
                                <button class="edit" style="margin-right:1rem" @click="subDetails">查看分佣</button>
                                <button class="edit" style="margin-right:1rem" @click="viewDetails(item,'finish')">查看已匹配服务人员</button>
                                <button class="edit" style="margin-right:1rem" @click="viewContract(item,'finish')">查看合同</button>
                                <button class = "edit" style = "margin-right:1rem" @click ="viewWriteSalary(item,'finish')" >填报工资</button>
                                <button class = "edit" style = "margin-right:1rem" @click ="viewAlreadySalary(item,'finish')" >已填报工资</button>
                            </div>
                        </div>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                    <section class="loading" v-show="loadingimg">
                        <van-loading type="spinner" color="#1989fa" />
                    </section>

                    <section v-if="loadingimgBottom">
                        <div class="dataLoading" >加载中...</div>
                    </section>
                </section>
            </van-tab>
        </van-tabs>
        <van-tabs style="margin-top:1rem" :color="'#20c3fc'" type="card" v-model="mergeActive" v-if="ismerge">
            <van-tab title="待匹配">
                <section class="tab" v-show="!loadingimg" style="top:3rem">
                    <div class="g-list" style=" margin-bottom: 3rem" v-if="mergeList.length > 0"  v-infinite-scroll="getMergeOrderList" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <div class="item" v-for="(item, index) in mergeList" :key="index" @click="toDetailsMerge(item)">
                            <div class="part">
                                <span class="u-text-title">客户姓名：</span>
                                <span class="u-text-des">{{item.userName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">订单类型：</span>
                                <span class="u-text-des">{{item.orderTypeName}}</span>
                                <span class="u-text-title" style="margin-left: 1rem">状态：</span>
                                <span class="u-text-des">{{item.orderStatusName}}</span>
                            </div>
                            <div class="part" style="display: flex;">
                                <span class="u-text-title" style="min-width: 5rem;">客户地址：</span>
                                <span class="u-text-des">{{item.userAddress}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">管家手机号：</span>
                                <span class="u-text-des">{{item.regionMobile}}</span>
                            </div>
                            <div v-if="countInfoMap[item.orderId].confirmBy > 0" class="part infoPart" style="display: flex;" @click.stop="orderCombineDetail('person', item.orderId)">
                                <span class="info">已有{{countInfoMap[item.orderId].confirmBy}}名服务人员向您发起合单请求</span>
                                <button class="checkItem">看一看</button>
                            </div>
                            <div v-if="countInfoMap[item.orderId].startBy > 0" class="part infoPart" style="display: flex;" @click.stop="orderCombineDetail('order', item.orderId)">
                                <span class="info">您已向{{countInfoMap[item.orderId].startBy}}名服务人员推送订单</span>
                                <button class="checkItem">看一看</button>
                            </div>
                        </div>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </section>
            </van-tab>
            <van-tab title="待确认合同">
                <section class="tab" v-show="!loadingimg" style="top:3rem">
                    <div class="g-list" v-if="contractConfirm.length > 0"  v-infinite-scroll="contractConfirmed" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <div class="item" v-for="(item, index) in contractConfirm" :key="index">
                            <div class="part">
                                <span v-if="false">{{item.orderContractId}}{{item.orderSignedId}}</span>
                                <span class="u-text-title">订单号：</span>
                                <span class="u-text-des">{{item.orderId}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">客户姓名：</span>
                                <span class="u-text-des">{{ item.userName }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">管家手机号：</span>
                                <span class="u-text-des">{{item.rechargeMobile }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">公司名称：</span>
                                <span class="u-text-des">{{ item.companyName }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">订单类型：</span>
                                <span class="u-text-des">{{item.orderTypeName  }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">状态：</span>
                                <span class="u-text-des">{{item.orderStatusName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">客户地址：</span>
                                <span class="u-text-des">{{item.userAddress}}</span>
                            </div>
                            <div class="part" style="text-align: left;">
                                <button v-if="!item.orderContractId" class="edit" style="margin-right:1rem" @click="insertContract(item)">新增合同</button>
                                <button v-if="item.orderContractId && (item.contractStatus === 1 || item.contractStatus === 2) " class="edit" style="margin-right:1rem" @click="perfectContract(item)">完善合同</button>
                                <button v-if="item.orderContractId && item.contractStatus === 3" class="edit" style="margin-right:1rem" @click="updateContract(item)">修改合同</button>
                                <button v-if="item.orderContractId && (item.contractStatus === 4 || item.contractStatus === 2)" class="edit" style="margin-right:1rem" @click="viewContract(item,'contractConfirm')">查看合同</button>
                                <button class="edit" style="margin-right:1rem" @click="viewDetails(item,'contractConfirm')">查看已匹配服务人员</button>
                            </div>
                            <div class="part">
                                <p style="color:red;word-break: break-all;" v-if="item.isShortTime === 1 && item.contractStatus === 3 && item.personStatus === 2">服务人员拒绝原因：{{item.personRefusalCause}}</p>
                                <p style="color:red;word-break: break-all;" v-if="item.isShortTime === 1 && item.contractStatus === 3 && item.userStatus == 2">用户拒绝原因：{{item.userRefusalCause}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </section>
            </van-tab>
            <van-tab title="待付款">
                <section class="tab" v-show="!loadingimg" style="top:3rem">
                    <div class="g-list" v-if="awaitingPay.length > 0"  v-infinite-scroll="awaitingPayment" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                        <div class="item" v-for="(item, index) in awaitingPay" :key="index">
                            <div class="part">
                                <span class="u-text-title">订单号：</span>
                                <span class="u-text-des">{{item.orderId}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">客户姓名：</span>
                                <span class="u-text-des">{{ item.userName }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">订单类型：</span>
                                <span class="u-text-des">{{item.orderTypeName  }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">状态：</span>
                                <span class="u-text-des">{{item.orderStatusName}}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">管家手机号：</span>
                                <span class="u-text-des">{{ item.rechargeMobile }}</span>
                            </div>
                            <div class="part">
                                <span class="u-text-title">客户地址：</span>
                                <span class="u-text-des">{{ item.userAddress }}</span>
                            </div>
                            <div class="part" style="text-align: left;">
                                <button class="edit" style="margin-right:1rem" @click="QrCodeshow(item)">付款二维码</button>
                                <button class="edit" style="margin-right:1rem" @click="viewDetails(item,'awaitingPay')">查看匹配的服务人员</button>
                                <button class="edit" style="margin-right:1rem" @click="viewContract(item,'awaitingPay')">查看合同</button>
                            </div>
                        </div>
                    </div>
                    <div class="no-list" v-else>
                        <img src="../assets/no-data.png" alt="">
                    </div>
                    <section class="loading" v-show="loadingimg">
                        <van-loading type="spinner" color="#1989fa" />
                    </section>

                    <section v-if="loadingimgBottom">
                        <div class="dataLoading" >加载中...</div>
                    </section>

                </section>
            </van-tab>
        </van-tabs>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" />
        </section>

        <section v-if="loadingimgBottom">
            <div class="dataLoading" >加载中...</div>
        </section>

        <!-- 二维码弹框专用 start -->
        <section class="loading" v-show="Overlay" style="color: #fff;z-index: 1100;">
            <van-loading type="spinner" color="#fff" style="z-index: 1100;"/>
        </section>
        <div v-if="Overlay" style="z-index: 1000;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0,0,0,.7);"></div>
         <getQrcode link="" msg="长按二维码分享给好友"></getQrcode>
         <!-- 二维码弹框专用 end -->
    </div>
</template>

<script>
    import { InfiniteScroll, Spinner } from 'mint-ui';
    import { Loading } from 'vant';
    import {Dialog} from 'vant';
    import { getOrderlist, moveToBroadOcean, retrieveOrderFromPool } from '@/api/order.js';
    export default {
        name: "orderManagerment",
        data () {
            return {
                active:0,
                mergeActive:0,
                allPage: false,
                onScroll: false,
                searchName:'',
                approvalStatus:0,
                reason:"",
                isBtns:false,
                loginId:0,
                orderPersonMap:{},
                countInfoMap:{},
                accountAmount:'',

                //我的录入
                orderlist: [],
                loading: false,
                mergerloading: false,
                currentPage: 0,
                loadingimg: true,

                //待合单
                ismerge:false,
                mergeList:[],
                currentPageRight:0,
                allPageRight: false,
                onScrollRight: false,

                //待签订确认合同contractConfirmed
                contractConfirm:[],
                currentPageContract:0,
                contractloading: false,
                allPageContract: false,
                onScrollContract: false,

                //待付款
                awaitingPay:[],
                currentPagePay:0,
                payloading: false,
                allPagePay: false,
                onScrollPay: false,


                //已合单
                mergedOrder:[],
                currentPageMerged:0,
                mergedloading: false,
                allPageMerged: false,
                onScrollMerged: false,


                noData:false,
                pageSize: 5,
                currentItem: {},
                isInPool : 1,
                searchState:true,
                loadingimgBottom:true,

                QrCodeBtn:false,
                Overlay:false
            }
        },

        mounted(){
            this.active = this.$route.query.val;
            if(this.active == 1){
                this.getMergeOrderList()
            }
            if(this.active == 0) {
                this.getOrderList()
            }
            if(this.active == 2) {
                this.mergedOrderList()
            }

            let that=this
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                Dialog.close()
                that.$router.push('/index');
            })


            this.$postwc('/sharePlatform-auth/auth/getUserCheckStatus',{
            }).then(res => {
                this.approvalStatus = res.data.approvalStatus;
                sessionStorage.setItem('merType',res.data.merType);
                if(res.data.approvalStatus == 2) this.reason = res.data.reason;
            });

            //初始化，清空二维码内容，并且关闭二维码
            this.$store.commit('QrCodeLink', '');
            this.$store.commit('QrCodeshow', false);
        },
        components: {
            [Loading.name]: Loading,
            [Spinner.name]: Spinner,
            [InfiniteScroll.name]: InfiniteScroll,
            getQrcode:() => import ('@/components/getQrcode.vue')
        },
        watch: {
            active(val){
                if (val == 1) {
                    this.getMergeOrderList()
                    this.ismerge = true
                    if(this.$route.query.mergeActive === 1){
                        this.mergeActive = 1
                    }
                    if(this.$route.query.mergeActive === 2){
                        this.mergeActive = 2
                    }
                    if(this.$route.query.mergeActive === 0){
                        this.mergeActive = 0
                    }
                }
                if(val === 0){
                    this.getOrderList()
                    this.ismerge = false
                }
                if(val == 2) {
                    this.mergedOrderList()
                    this.ismerge = false
                }
            },
            mergeActive(val){
                if(val == 0){
                    this.getMergeOrderList()
                }
                if(val==1){
                    this.contractConfirmed()
                }
                if(val==2){
                    this.awaitingPayment()
                }

            },
            searchName:function(val, oldVal){
                let that=this
                that.allPage=false;
                that.onScroll=false;
                that.searchState=false;
                that.currentPage=0;
                if(val !== oldVal){
                    this.searchState = true
                    that.orderlist=[];
                    this.onSearch()
                }
                if(val==''){
                    that.orderlist=[];
                    that.getOrderList()
                }
            }
        },

        methods:{
            //查看二维码  未完成
            QrCodeshow(data){
                // if(this.QrCodeBtn) return false;
                // this.QrCodeBtn = this.Overlay = true;
                let params = {orderSignedId:data.orderSignedId};
                let url = '/sharePlatform-order/accountPay/queryUnpaidAmount';
                this.$postwc(url,params).then(res => {
                    if(res.code === 'I1-00-001'){
                        if(res.data){
                            this.$router.push({
                                name: 'textVue',
                                query: {
                                    orderContractId: data.orderContractId,
                                    orderSignedId: data.orderSignedId,
                                    orderPrice:res.data,
                                    text: '支付付款',
                                    type:'view',
                                }
                            })
                            // localStorage.setItem("orderContractId",res.data.orderContractId);
                        }
                        console.log("咋回事那你",res)
                        // this.payObj.bankCardName=res.data.;
                        // this.contract = res.data
                    }else if(res.code === 'W2-00-001'){
                        alert(res.msg);
                    }else if(res.code==='W2-00-010' ){
                        alert(res.msg)
                    }else{
                        alert("执行异常")
                    }


                    // if(res.data){
                    //     this.$store.commit('QrCodeLink', res.data);
                    //     this.$store.commit('QrCodeshow', true);
                    //     this.QrCodeBtn = this.Overlay = false;
                    // }else{
                    //     this.QrCodeBtn = this.Overlay = false;
                    //     this.$toast('请稍后再试');
                    // }
                }).catch( err => {
                    this.QrCodeBtn = this.Overlay = false;
                    this.$toast('网络异常，请稍后再试');
                });
            },
            // 我的录入
            getOrderList () {
                let that = this;
                this.isBtns=false;
                that.loading = true;
                this.searchState = false
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$postwc('/sharePlatform-order/OrderConsume/queryOrderList', {
                        pageNum: that.currentPage,
                        pageSize: 5,
                        userName:this.searchName,
                        userMobile:this.searchName,
                        orderTypeName:this.searchName
                    }).then(res => {
                        this.isBtns=false;
                        this.loadingimg = false;
                        if (res.code === 'I1-00-001') {
                            if (res.data === null) {
                                that.allPage = true
                                that.onScroll = true
                                return false
                            }
                            that.orderlist = that.orderlist.concat(res.data.list);
                            that.loading = false;
                            if (res.data.list.length < 5) {
                                that.allPage = false;
                                that.onScroll = true;
                            }else{
                                that.onScroll = false;
                            }

                            // this.isBtns=true;
                            this.searchState = true;
                        }
                        that.loadingimgBottom = false;
                    })

                }, 300)

            },

            //合单中-待匹配
            getMergeOrderList () {
                let that = this;
                that.mergerloading = true
                if (that.allPageRight === true) {
                    return false;
                }
                if (that.onScrollRight === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                that.onScrollRight = true;
                setTimeout(() => {
                    that.currentPageRight++;
                    that.$postwc('/sharePlatform-order/orderCombine/orderCombineList', {
                        confirmStatus:0,
                        pageNum: that.currentPageRight,
                        pageSize: 5
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code == 'I1-00-001') {
                            if (res.data === null) {
                                this.allPageRight = true
                                return false
                            }
                            that.loginId = res.data.bmsUserId;
                            that.orderPersonMap = res.data.orderPerson;
                            that.countInfoMap = res.data.countInfo;
                            that.mergeList = that.mergeList.concat(res.data.baseInfo.list);
                            that.mergerloading = false;
                            if (res.data.baseInfo.list.length < 5) {
                                that.allPageRight = false
                            }else {
                                that.onScrollRight = false;
                            }
                        }
                        that.loadingimgBottom = false;
                    })
                }, 300)
            },

            //合单中 - 待签订确认合同
            contractConfirmed(){
                let that = this;
                that.contractloading = true
                if (that.allPageContract === true) {
                    return false;
                }
                if (that.onScrollContract === true) {
                    return false;
                }
                that.onScrollContract = true;
                setTimeout(() => {
                    that.currentPageContract++;
                    that.$postwc('/sharePlatform-order/orderSigned/orderSignedList', {
                        orderStatus:1,
                        pageNum: that.currentPageContract,
                        pageSize: 5
                    }).then(res => {
                        that.contractloading = false;

                        if (res.code === 'I1-00-001') {
                            if (res.data.list === null) {
                                that.allPageContract = true
                                that.onScrollContract = true
                                return false
                            }
                            that.contractConfirm = that.contractConfirm.concat(res.data.list);
                            that.loading = false;
                            if (res.data.list.length < 5) {
                                that.allPageContract = false;
                                that.onScrollContract = true;
                            }else{
                                that.onScrollContract = false;
                            }
                        }
                        that.loadingimgBottom = false;
                    })
                }, 300)
            },

            //待付款
            awaitingPayment(){
                let that = this;
                that.payloading = true
                if (that.allPagePay === true) {
                    return false;
                }
                setTimeout(() => {
                    that.currentPagePay++;
                    that.$postwc('/sharePlatform-order/orderSigned/orderSignedList', {
                        orderStatus:2,
                        pageNum: that.currentPagePay,
                        pageSize: 5
                    }).then(res => {
                        that.payloading = false;
                        if (res.code == 'I1-00-001') {
                            if (res.data === null) {
                                this.allPagePay = true
                                return false
                            }
                            that.awaitingPay = that.awaitingPay.concat(res.data.list);
                            that.payloading = false;
                            if (that.currentPage >= res.data.pages) {
                                that.allPagePay = true;
                            }else{
                                that.allPagePay = false;
                            }
                        }
                        that.loadingimgBottom = false;
                    })
                }, 300)
            },

            //已完成
            mergedOrderList(){
                let that = this;
                that.mergedloading = true

                if (that.allPageMerged === true) {
                    return false;
                }
                that.allPageMerged === true;

                setTimeout(() => {
                    that.currentPageMerged++;
                    that.$postwc('/sharePlatform-order/orderSigned/orderSignedList', {
                        orderStatus:3,
                        pageNum: that.currentPageMerged,
                        pageSize: 5
                    }).then(res => {
                        that.mergedloading = false;
                        that.loadingimg = false;
                        if (res.code == 'I1-00-001') {
                            if (res.data.list === null) { return false }
                            that.mergedOrder = that.mergedOrder.concat(res.data.list);

                            if(that.currentPageMerged >= res.data.pages){
                                this.allPageMerged = true;
                            }else{
                                this.allPageMerged = false;
                            }
                        }
                        that.loadingimgBottom = false;
                    })
                }, 300)
            },

            // 去详情页面
            toDetails(item){
                this.$router.push({
                    name: 'orderDetails',
                    query: {
                        orderId: item.orderId,
                        val:0,
                        url:'/index/orderManagerment'
                    }
                })
            },

            toDetailsMerge(item){
                this.$router.push({
                    name: 'orderDetails',
                    query: {
                        orderId: item.orderId,
                        val:1,
                        url:'/index/orderManagerment'
                    }
                })
            },

            //待合单-待确认合同-查看匹配服务人员
            viewDetails(item,status){
                console.log(item)
                this.$router.push({
                    name: 'servicerDetails',
                    query: {
                        personnelId: item.personalId,
                        status:status,
                        type:4

                    }
                })
            },

            //完善合同
            perfectContract(item){
                this.$postwc('/sharePlatform-order/auth/guest/queryCompanyIsPerfect',
                    localStorage.getItem('companyId')
                    // 'platform':'sharePlatform-weixin',
                    // 'jzpt-token':localStorage.getItem('token')? localStorage.getItem('token'):'',
                    // "queryIsPerfect":item.orderContractId
                ).then(res => {
                    if(res.data.isPerfect===1){
                        //正常使用
                        this.$router.push({
                            name: 'completeContract',
                            query: {
                                orderContractId: item.orderContractId,
                                orderSignedId:item.orderSignedId,
                                type:'edit',
                                text:'完善合同',
                                isView:false
                            }
                        })
                    }else{
                        this.$toast(res.data.msg)
                    }

                })

            },
            //新增合同
            insertContract(item){
                this.$postwc('/sharePlatform-order/auth/guest/queryCompanyIsPerfect',
                    localStorage.getItem('companyId')
                ).then(res => {
                    if(res.data.isPerfect===1){
                        this.$router.push({
                            name: 'completeContract',
                            query: {
                                orderContractId: item.orderContractId,
                                orderSignedId:item.orderSignedId,
                                orderType:'1',
                                type:'edit',
                                isView:false,
                                text:'新增合同'
                            }
                        })
                    }else{
                        this.$toast(res.data.msg)
                    }
                });


            },
            //待合单-待确认合同 修改合同
            updateContract(item){
                this.$router.push({
                    name: 'completeContract',
                    query: {
                        orderContractId: item.orderContractId,
                        orderSignedId:item.orderSignedId,
                        type:'edit',
                        isView:false,
                        text:'修改合同'
                    }
                })
            },

            //查看合同
            viewContract(item,status){
                this.$router.push({
                    name: 'completeContract',
                    query: {
                        orderContractId: item.orderContractId,
                        orderSignedId:item.orderSignedId,
                        type:'view',
                        status:status,
                        text:'查看合同',
                        isView:true
                    }
                })
            },
            //填报工资
            viewWriteSalary(item,status){
                this.$postwc('/sharePlatform-order/salary/queryNormalSalary', {
                    orderContractId:item.orderContractId,
                }).then(res => {
                    if(res.code=='I1-00-001'){
                        this.$router.push({
                            name: 'addWriteSalary',
                            query: {
                                orderContractId: item.orderContractId,
                                orderSignedId:item.orderSignedId,
                                orderId:  item.orderId,
                                type:'view',
                                status:status,
                                text:'填报工资',
                                money:res.data,
                                userMobile:item.userMobile
                            }
                        })
                    }else{
                        alert('查询合同失败')
                    }
                })

            },

            //已填报工资
            viewAlreadySalary(item,status){
                this.$router.push({
                    name: 'addAlreadySalary',
                    query: {
                        orderContractId: item.orderContractId,
                        orderSignedId:item.orderSignedId,
                        orderId: item.orderId ,
                        type:'view',
                        status:status,
                        text:'已填报工资'
                    }
                })
            },

            //搜索回车、确定键
            onSearch(){
                if(this.searchName == ''){
                    return false
                }
                if(this.searchState === true){
                    this.searchState = false
                    this.currentPage = 0
                    this.allPage=false
                    this.onScroll=false
                    this.orderlist=[]
                    this.getOrderList()
                }


            },
            //搜索取消
            onCancel(){
                this.currentPage = 0
                this.allPage=false
                this.onScroll=false
                this.orderlist=[]
                this.getOrderList()
            },
            //清除搜索
            clear(){
                this.currentPage = 0
                this.allPage= false
                this.onScroll= false
                this.orderlist=[]
                this.getOrderList()
            },
            changeSearchName(){
                this.allPage=false
                this.onScroll= false
                if(this.searchName == null || this.searchName.length == ''){

                    this.currentPage =0
                    this.orderlist=[]
                    this.getOrderList()
                }
            },

            //查看合单意向详情
            orderCombineDetail(type, orderId){
                sessionStorage.setItem('type',type);
                sessionStorage.setItem('orderId',orderId)
                this.$router.push({
                    name:'promotedServicePersonnel',
                    query: {
                        orderId: orderId,
                        type:type
                    }
                })
            },

            //查看分佣详情
            // details(){
            //     this.$route.push({
            //         name:'subCommission',
            //         types:1
            //     })
            // },

            //查看分佣
            subDetails(){
                this.$router.push({
                    path:'/index/subCommission',
                    query: {
                        type:5
                    }
                })
            },

            // 修改订单
            updateOrder (item) {
                this.$router.push({
                    name: 'updateOrder',
                    query: {
                        orderId: item.orderId
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
    .info{
        padding:0.5rem 0;
        width:80%;
        margin-top:px2rem(10px);
    }
    .infoPart{
        display: flex;
        border-top-width: .5rem;
        border-top-color: rgba(0, 0, 0,0.08);
        border-top-style: inset;
        padding: 1rem 0.9375rem;
    }
    .dataLoading{
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        z-index: 21;
        left: 40%;
    }
    .checkItem {
        /*background: rgba(238, 115, 165, 0.41);*/
        background: rgba(0, 183, 238, 0.41);
        font-size: 0.875rem;
        /*font-weight: bold;*/
        color: #000;
        border: none;
        padding: 0.5rem 0.625rem;
    }
    .tab {
        overflow: scroll;
        height: 100vh;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
       margin-top: 5.2rem;
        .g-list {
            padding: 0 px2rem(15px) px2rem(80px);
            margin-bottom: 3rem;
            .item {
                width:100%;
                height: max-content;
                padding-bottom: 0.5rem;
                background:rgba(255,255,255,1);
                box-shadow:0px 7px 20px 0px rgba(0,0,0,0.08);
                border-radius:6px;
                margin-bottom: 1rem;
                margin-top: 1rem;
                border: 1px solid #ddd;

                .part {
                    padding: 0 px2rem(15px);
                    margin-top: px2rem(15px);

                    span {
                        display: inline-block;
                    }

                    .u-text-title {
                        font-weight: bold;
                        font-size: px2rem(16px);


                    }

                    .u-text-des {
                        font-size: px2rem(16px);
                        word-break:break-all
                    }
                    .btns {
                        position: absolute;
                        right: px2rem(15px);
                        bottom: 0rem;

                        button {
                            border: none;
                            height: px2rem(25px);
                            padding: 0 px2rem(3px);
                        }

                        .edit {
                            background: #fc4949;
                            font-size: px2rem(14px);
                            font-weight: bold;
                            color: #fff;
                        }

                        .move {
                            background: #60a0fc;
                            font-size: px2rem(14px);
                            font-weight: bold;
                            color: #fff;
                            margin-left: px2rem(10px);
                        }
                    }
                    button {
                        /*font-size: 14px;*/
                        /*padding: 8px;*/
                        /*border: 1px solid #26a2ff;*/
                        /*border-radius: 6px;*/
                        /*background: #fff;*/
                        /*margin-right: px2rem(10px);*/
                        margin-top: px2rem(10px);
                        /*margin-right: px2rem(16px);*/
                    }
                }
            }
        }
        .no-list {
            padding: px2rem(65px) px2rem(15px) 0;
            text-align: center;
            font-size: px2rem(15px);
            img {
                width: px2rem(260px);
            }
        }
    }
    .loading {
        padding-top: 6rem;
        div {
            margin: 0 auto;
        }
    }
    .edit {
        border:none;
        background: rgba(0, 183, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
    .tosea {
        border:none;
        background: rgba(2, 238, 107, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
    .reback {
        border:none;
        background: rgba(238, 225, 87, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
    .van-dialog {
        .van-dialog__content {
            text-align: center;
            input {
                border:none;
                border-bottom: 1px solid #ddd;
                height: 1.5625rem;
                line-height: 1.5625rem;
                width: 15rem;
                outline: none;
                margin: 1.2rem auto;
            }
        }
    }
</style>
