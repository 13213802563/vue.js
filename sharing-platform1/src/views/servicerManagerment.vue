<template>
    <div>
        <mt-header title="服务人员管理系统" style="z-index: 999">
            <router-link to="/index" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <router-link to="/index/servicerManagerment/addServicer" slot="right">
                <mt-button>新增</mt-button>
            </router-link>
        </mt-header>
        <van-tabs v-model="active" :font-size="'16px'">
            <van-tab title="我的录入">
                <van-search
                        v-model="searchVal"
                        placeholder="输入姓名、手机号、工种进行搜索"
                        show-action
                        shape="round"
                        @search="onSearch"
                >
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
                <div v-show="!loadingimg"
                     style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top:8rem;">
                    <div class="g-list" v-if="userList.length > 0" v-infinite-scroll="loadMore"
                         :infinite-scroll-disabled="loading" infinite-scroll-distance="50">

                        <template v-for="value in userList">
                            <div class="item" @click="goDetails(value)">
                                <div class="part">
                                    <span class="u-text-title">姓名:</span>
                                    <span class="u-text-des">{{value.userName}}</span>
                                </div>

                                <img :src="value.headPic" alt="">

                                <div class="part">
                                    <span class="u-text-title">性别：</span>
                                    <span class="u-text-des">{{value.sexStr}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">服务人员手机：</span>
                                    <span class="u-text-des">{{value.mobile}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">身份证号：</span>
                                    <span class="u-text-des"
                                          v-if="value.companyId == value.source">{{value.idCardNum}}</span>
                                    <span class="u-text-des" v-else>{{addStar(value.idCardNum)}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">年龄：</span>
                                    <span class="u-text-des">{{value.age}}</span>
                                    <span class="u-text-title" style="margin-left: 1rem">工种：</span>
                                    <span class="u-text-des" style="flex: 1;">{{value.workerName}}</span>
                                </div>
                                <div class="part" style="position: relative">
                                    <span class="u-text-title">工作城市：</span>
                                    <span class="u-text-des">{{value.serviceCityStr}}</span>
                                </div>
                                <div class="part" style="text-align: left;display: block;">
                                    <button class="edit"
                                            @click.stop="updateOrder(value)">修改信息
                                    </button>
                                </div>
                            </div>
                        </template>

                    </div>
                    <div class="no-list" style="margin-top: 5rem;" v-if="searchState && noData">
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </div>
            </van-tab>
            <van-tab title="合单中" style="font-size: 16px;">
                <keep-alive>
                    <van-tabs type="card" :color="'#20c3fc'" style="margin-top: 1rem;" v-model="orderStatus">
                        <van-tab title="待匹配">
                            <div v-show="!loadingimg"
                                 style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 8rem;">
                                <div class="g-list" v-if="rightList.length > 0" v-infinite-scroll="waitingListRight"
                                     :infinite-scroll-disabled="rightLoading" infinite-scroll-distance="50">
                                    <template v-for="item in rightList" class="g-list">
                                        <div class="item">
                                            <div class="part">
                                                <span class="u-text-title">姓名:</span>
                                                <span class="u-text-des">{{item.userName}}</span>
                                            </div>
                                            <img :src="item.headPic" alt="">
                                            <div class="part">
                                                <span class="u-text-title">管家手机号：</span>
                                                <span class="u-text-des">{{item.mobile}}</span>
                                            </div>
                                            <div class="part">
                                                <span class="u-text-title">年龄：</span>
                                                <span class="u-text-des">{{item.age}}</span>
                                                <span class="u-text-title" style="margin-left: 1rem">工种：</span>
                                                <span class="u-text-des" style="flex: 1;">{{item.workerName}}</span>
                                            </div>
                                            <div class="part">
                                                <span class="u-text-title">工作城市：</span>
                                                <span class="u-text-des">{{item.serviceCity}}</span>
                                            </div>
                                            <div class="part" v-if="item.otherPushNum!==0"
                                                 style="display: flex;align-items: center;border-top: 10px solid #f4f4f4; height: 3rem;">
                                                <span class="u-text-title">已有{{item.otherPushNum}}个客户订单向您发起合单请求</span>
                                                <button class="edit"
                                                        style="margin: 0;margin-left: 0.5rem;position: absolute;right: 0.5rem;"
                                                        @click.stop="look(item,1)">看一看
                                                </button>
                                            </div>
                                            <div class="part" v-if="item.myPushNum!==0"
                                                 style="display: flex;align-items: center;border-top: 10px solid #f4f4f4;height: 3rem;">
                                                <span class="u-text-title">您已向{{item.myPushNum}}个客户订单推送服务人员 </span>
                                                <button class="edit"
                                                        style="margin: 0;margin-left: 0.5rem;position: absolute;right: 0.5rem;"
                                                        @click.stop="look(item,2)">看一看
                                                </button>
                                            </div>
                                        </div>

                                    </template>
                                </div>
                                <div class="no-list" v-if="noData">
                                    <img src="../assets/no-data.png" alt="">
                                </div>
                            </div>
                        </van-tab>
                        <van-tab title="待确认合同">
                            <div v-show="!loadingimg"
                                 style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 8rem;">
                                <div class="g-list" v-if="contractList.length > 0" v-infinite-scroll="pendingContract"
                                     :infinite-scroll-disabled="contractLoading" infinite-scroll-distance="50">
                                    <template v-for="item in contractList" class="g-list">
                                        <div class="item">
                                            <div class="part">
                                                <span class="u-text-title">姓名:</span>
                                                <span class="u-text-des">{{item.userName}}</span>
                                            </div>
                                            <img :src="item.headPic" alt="">
                                            <div class="part">
                                                <span class="u-text-title">管家手机号：</span>
                                                <span class="u-text-des">{{item.mobile}}</span>
                                            </div>
                                            <div class="part">
                                                <span class="u-text-title">年龄：</span>
                                                <span class="u-text-des">{{item.age}}</span>
                                                <span class="u-text-title" style="margin-left: 1rem">工种：</span>
                                                <span class="u-text-des" style="flex: 1;">{{item.workerName}}</span>
                                            </div>
                                            <div class="part">
                                                <span class="u-text-title">工作城市：</span>
                                                <span class="u-text-des">{{item.serviceCity}}</span>
                                            </div>
                                            <div class="part" style="text-align: left;display: block;">
                                                <button class="edit"
                                                        @click.stop="matchedOrders(item,1)">查看已匹配订单
                                                </button>
                                            </div>
                                        </div>

                                    </template>
                                </div>
                                <div class="no-list" v-if="noData">
                                    <img src="../assets/no-data.png" alt="">
                                </div>
                            </div>
                        </van-tab>
                        <van-tab title='待付款'>
                            <div v-show="!loadingimg"
                                 style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 8rem;">
                                <div class="g-list" v-if="prePaymentList.length > 0" v-infinite-scroll="prePayment"
                                     :infinite-scroll-disabled="prePaymentLoading" infinite-scroll-distance="50">
                                    <template v-for="item in prePaymentList" class="g-list">
                                        <div class="item">
                                            <div class="part">
                                                <span class="u-text-title">姓名:</span>
                                                <span class="u-text-des">{{item.userName}}</span>
                                            </div>
                                            <img :src="item.headPic" alt="">
                                            <div class="part">
                                                <span class="u-text-title">管家手机号：</span>
                                                <span class="u-text-des">{{item.mobile}}</span>
                                            </div>
                                            <div class="part">
                                                <span class="u-text-title">年龄：</span>
                                                <span class="u-text-des">{{item.age}}</span>
                                                <span class="u-text-title" style="margin-left: 1rem">工种：</span>
                                                <span class="u-text-des" style="flex: 1;">{{item.workerName}}</span>
                                            </div>
                                            <div class="part">
                                                <span class="u-text-title">工作城市：</span>
                                                <span class="u-text-des">{{item.serviceCity}}</span>
                                            </div>
                                            <div class="part" v-if="item.otherPushNum!==0"
                                                 style="display: flex;align-items: center;border-top: 10px solid #f4f4f4; height: 3rem;">
                                                <span class="u-text-title">已有{{item.otherPushNum}}个客户订单向您发起合单请求</span>
                                                <button class="edit"
                                                        style="margin: 0;margin-left: 0.5rem;position: absolute;right: 0.5rem;"
                                                        @click.stop="look(item,1)">看一看
                                                </button>
                                            </div>
                                            <div class="part" v-if="item.myPushNum!==0"
                                                 style="display: flex;align-items: center;border-top: 10px solid #f4f4f4;height: 3rem;">
                                                <span class="u-text-title">您已向{{item.myPushNum}}个客户订单推送服务人员 </span>
                                                <button class="edit"
                                                        style="margin: 0;margin-left: 0.5rem;position: absolute;right: 0.5rem;"
                                                        @click.stop="look(item,2)">看一看
                                                </button>
                                            </div>
                                            <div class="part" style="text-align: left;display: block;">
                                                <button class="edit"
                                                        @click.stop="matchedOrders(item,2)">查看已匹配订单
                                                </button>
                                                <button class="edit"
                                                        @click.stop="viewContract2(item,'prePayment')">查看合同
                                                </button>
                                            </div>
                                        </div>

                                    </template>
                                </div>
                                <div class="no-list" v-if="noData">
                                    <img src="../assets/no-data.png" alt="">
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                </keep-alive>

            </van-tab>
            <van-tab title="已完成" style="font-size: 16px;">
                <div v-show="!loadingimg"
                     style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;top: 5rem;">
                    <div class="g-list" v-if="completedList.length > 0" v-infinite-scroll="completed"
                         :infinite-scroll-disabled="completedLoading" infinite-scroll-distance="50">
                        <template v-for="item in completedList" class="g-list">
                            <div class="item">
                                <div class="part">
                                    <span class="u-text-title">姓名:</span>
                                    <span class="u-text-des">{{item.userName}}</span>
                                </div>
                                <img :src="item.headPic" alt="">
                                <div class="part">
                                    <span class="u-text-title">管家手机号：</span>
                                    <span class="u-text-des">{{item.mobile}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">年龄：</span>
                                    <span class="u-text-des">{{item.age}}</span>
                                    <span class="u-text-title" style="margin-left: 1rem">工种：</span>
                                    <span class="u-text-des" style="flex: 1;">{{item.workerName}}</span>
                                </div>
                                <div class="part">
                                    <span class="u-text-title">工作城市：</span>
                                    <span class="u-text-des">{{item.serviceCity}}</span>
                                </div>
                                <div class="part" style="text-align: left;display: block;">
                                    <button class="edit"
                                            @click.stop="subServicing()">查看分佣
                                    </button>
                                    <button class="edit"
                                            @click.stop="matchedOrders(item,'active')">查看已匹配订单
                                    </button>
                                    <button class="edit"
                                            @click.stop="viewContract2(item,'completed')">查看合同
                                    </button>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="no-list" v-if="noData">
                        <img src="../assets/no-data.png" alt="">
                    </div>
                </div>
            </van-tab>
        </van-tabs>


        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
        <!--        <section>-->
        <!--            <div class="dataLoading" >加载中...</div>-->
        <!--        </section>-->
        <van-dialog
                v-model="Feeshow"
                title="请输入佣金"
                show-cancel-button
                @confirm="confirmFee"
        >
            <div style="text-align: center;">
                <input type="text" maxlength="10" v-model="feeMoney" @input="checkPoint">
            </div>
        </van-dialog>
    </div>

</template>

<script>
    import {moveFromBroadOcean, moveToBroadOceanService} from '@/api/order.js';
    import {Loading} from 'vant';
    import {Tab, Tabs} from 'vant';

    export default {
        name: "servicerManagerment",
        components: {
            [Loading.name]: Loading,
        },
        meta: {
            keepAlive: true //需要被缓存的组件
        },
        computed: {
            searchStates() {
                let that = this;
                return that.searchState = false
            }
        },
        watch: {
            active(val) {
                let that = this
                that.resetTagInfor()
                if (val == 1) {
                    /*合单中*/
                    if (that.orderStatus == '1') {
                        that.pendingContract()
                    } else if (that.orderStatus == '2') {
                        that.prePayment()
                    } else if (that.orderStatus == '0'){
                        that.waitingListRight()
                    }
                } else if (val == 2) {//已完成
                    that.completed()
                } else {
                    that.loadMore()
                }

            },
            orderStatus(val) {
                let that = this;
                that.resetTagInfor()
                if (val == '0') {
                    that.waitingListRight()
                } else if (val == '1') {
                    that.pendingContract()
                } else if (val == '2') {
                    that.prePayment()
                }
            },
            searchVal: function (val, oldVal) {
                let that = this
                that.allPage = false;
                that.onScroll = false;
                that.searchState = false;
                that.currentPage = 0;
                if (val == '') {
                    that.userList = [];
                    that.loadMore()
                    console.log(that.list)
                }
            }
        },
        methods: {
            /*重置标记信息*/
            resetTagInfor(){
                let that = this
                that.userList = []
                that.completedList = []
                that.rightList = []
                that.contractList = []
                that.prePaymentList = []
                that.currentPage = 0
                that.currentPageRight = 0
                that.currentPageContract = 0
                that.currentPageCompleted = 0
                that.currentPagePrePayment = 0
                that.allPage= false
                that.onScroll= false
                that.allPageRight= false
                that.onScrollRight= false
                that.allPageCompleted= false
                that.onScrollCompleted= false
                that.allPageContract= false
                that.onScrollContract=false
                that.allPagePrePayment= false
                that.onScrollPrePayment= false

                that.noData = false
                that.loading = false
                that.rightLoading = false
                that.completedLoading = false
                that.contractLoading = false
                that.prePaymentLoading = false
            },
            //查看已匹配订单
            matchedOrders(val, index) {
                let that = this;
                if (index == 1) {//合单中待确认合同
                    that.tatus = "orderStatusOne"
                } else if (index == 2) {//合单中待付款
                    that.tatus = "orderStatusTwo"

                } else if (index == 'active') {//已完成
                    that.tatus = 'active'
                }
                this.$router.push({
                path: 'viewPublicOrders/viewPublicOrdersDetails',
                query: {
                    orderId: val.orderSignedId,
                    type: that.tatus
                }
            })
        },
            // //待确认合同查看合同
            // viewContract1(val, index) {
            //     this.$router.push({
            //         name: 'completeContract',
            //         query: {
            //             orderContractId: val.contractId,
            //             orderSignedId: val.orderSignedId,
            //             text: '查看合同',
            //             orderType:'6',
            //             type:'view',
            //             isView:true,
            //             value: index == 'prePayment' ? "prePayment" : 'completed'
            //         }
            //     })
            // },
            //待付款查看合同
            viewContract(val, index) {

                this.$router.push({
                    name: 'completeContract',
                    query: {
                        orderContractId: val.contractId,
                        orderSignedId: val.orderSignedId,
                        text: '查看合同',
                        orderType:'7',
                        type:'view',
                        isView:true,
                        value: index == 'prePayment' ? "prePayment" : 'completed'
                    }
                })
            },
            //已完成查看合同
            viewContract2(val, index) {
                this.$router.push({
                    name: 'completeContract',
                    query: {
                        orderContractId: val.contractId,
                        orderSignedId: val.orderSignedId,
                        text: '查看合同',
                        orderType:'8',
                        type:'view',
                        isView:true,
                        value: index == 'prePayment' ? "prePayment" : 'completed'
                    }
                })
            },
            //查看分佣
            subServicing() {
                this.$router.push('/index/subCommission?type=subServicing')
            },
            /*搜索*/
            onSearch() {
                let that = this;
                that.loading = true;
                console.log(that.searchVal)
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom = true;
                that.onScroll = true;
                setTimeout(() => {
                    that.$post('/sharePlatform-person/personnel/managerSearch', {
                        searchValue: that.searchVal,
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.userList = res.data;
                        if (that.userList.length > 0) {
                            that.allPage = false;
                            that.onScroll = true;
                            that.loadingimgBottom = false;
                        } else {
                            that.searchState = true
                            that.noData = true
                        }
                    })
                }, 300)
            },
            //放入看人公海池
            watchingPool(val) {
                this.$post('/sharePlatform-person/seeNum/putPerson', {
                    empId: val.personnelId,
                    userId: val.userId
                }).then(res => {
                    console.log(res)
                    if (res.code == 'I1-00-9999') {
                        this.$toast('成功');
                        this.$router.go(0)
                    } else if (res.code.indexOf('I1') != '-1') {
                        this.$toast(res.msg);
                        //this.$router.go(0)
                    } else {
                        this.$toast('请求失败，请稍后重试');
                    }
                })
            },
            //从看人公海池收回
            watchingPoolRecovery(val) {
                this.$post('/sharePlatform-person/seeNum/retrievePerson', {
                    empId: val.personnelId,
                    userId: val.userId
                }).then(res => {
                    console.log(res)
                    if (res.code == 'I1-00-9999') {
                        this.$toast('成功');
                        this.$router.go(0);
                    } else if (res.code.indexOf('I1') != '-1') {
                        this.$toast(res.msg);
                        //this.$router.go(0)
                    } else {
                        this.$toast('请求失败，请稍后重试');
                    }
                })
            },
            addStar(str) {
                return str.replace(/(\d{6})\d{6}(\d{3})/, '$1******$2')
            },
            checkPoint() {
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(this.feeMoney)) {
                    var s = this.feeMoney + "";
                    this.feeMoney = this.feeMoney.substring(0, this.feeMoney.indexOf(".") + 3);
                }
            },
            goDetails(value) {
                console.log(value)
                this.$router.push('/index/servicerManagerment/servicerDetails?personnelId=' + value.personnelId + '&isInPool=' + value.isInPool + '&seeNum=' + value.seeNum)
            },
            /*我的录入列表*/
            loadMore() {
                let that = this;
                that.loading = true;
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
                    that.$post('/sharePlatform-person/personnel/queryPersonnel', {
                        currentPage: that.currentPage,
                        pageSize: '5',
                        companyId: localStorage.getItem('companyId')
                    }).then(res => {

                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.userList = that.userList.concat(res.data.list)
                        that.loading = false;
                        if (res.data.list.length == 0) {
                            if(that.currentPage>1){
                                that.noData = false
                            }else{
                                that.noData = true
                            }
                            that.loading = true
                        } else {
                            that.noData = false
                        }

                        if (res.data.list.length < 5) {
                            that.allPage = true;
                            that.loading = true;
                        }else{
                            that.onScroll = false;
                        }
                    })

                }, 300)
            },
            /*合单中（待匹配）*/
            waitingListRight() {
                let that = this;
                that.rightLoading = true
                if (that.allPageRight === true) {
                    return false;
                }
                if (that.onScrollRight === true) {
                    return false;
                }
                that.onScrollRight = true;
                setTimeout(() => {
                    that.currentPageRight++;
                    that.$post('/sharePlatform-person/personnel/queryManagerWaitOrderPersonnel', {
                        companyId: localStorage.getItem('companyId'),
                        currentPage: that.currentPageRight,
                        pageSize: '5'
                    }).then(res => {
                        that.loadingimg = false;

                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.rightList = that.rightList.concat(res.data.list)
                        that.rightLoading = false;
                        if (that.rightList.length == 0) {
                            if(that.currentPageRight>1){
                                that.noData = false
                            }else{
                                that.noData = true
                            }
                            that.loadingimg = false;
                        } else {
                            that.noData = false
                        }

                        if (res.data.list.length < 5) {
                            that.allPageRight = true;
                            that.rightLoading = true;
                            //that.loadingimg = true;
                        }
                        that.onScrollRight = false;
                    })
                }, 300)
            },
            //合单中（待确认合同）
            pendingContract() {
                let that = this;
                that.contractLoading = true
                if (that.allPageContract === true) {
                    return false;
                }
                if (that.onScrollContract === true) {
                    return false;
                }
                that.onScrollContract = true;
                setTimeout(() => {
                    that.currentPageContract++;
                    that.$post('/sharePlatform-person/personnel/queryToBeContractPersonList', {
                        companyId: localStorage.getItem('companyId'),
                        currentPage: that.currentPageContract,
                        pageSize: '5'
                    }).then(res => {
                        that.loadingimg = false;
                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.contractList = that.contractList.concat(res.data.list)
                        that.contractLoading = false;
                        if (that.contractList.length == 0) {
                            if(that.currentPageContract>1){
                                that.noData = false
                            }else{
                                that.noData = true
                            }
                            that.contractLoading = true
                        } else {
                            that.noData = false
                        }

                        if (res.data.list.length < 5) {
                            that.allPageContract = true;
                            that.contractLoading = true
                        }
                        that.onScrollContract = false;
                    })
                }, 300)
            },
            //合单中（待付款）
            prePayment() {
                let that = this;
                that.prePaymentLoading = true

                if (that.allPagePrePayment === true) {
                    return false;
                }
                if (that.onScrollPrePayment === true) {
                    return false;
                }
                that.onScrollPrePayment = true;
                setTimeout(() => {
                    that.currentPagePrePayment++;
                    that.$post('/sharePlatform-person/personnel/queryToBePayPersonList', {
                        companyId: localStorage.getItem('companyId'),
                        currentPage: that.currentPagePrePayment,
                        pageSize: '5'
                    }).then(res => {
                        that.loadingimg = false;

                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.prePaymentList = that.prePaymentList.concat(res.data.list)
                        that.prePaymentLoading = false;
                        if (that.prePaymentList.length == 0) {
                            if(that.currentPagePrePayment>1){
                                that.noData = false
                            }else{
                                that.noData = true
                            }
                            that.prePaymentLoading = true
                        } else {
                            that.noData = false
                        }

                        if (res.data.list.length < 5) {
                            that.allPagePrePayment = true;
                            that.prePaymentLoading = true
                        }
                        that.onScrollPrePayment = false;
                    })
                }, 300)
            },

            /*已完成列表*/
            completed() {
                let that = this;
                that.completedLoading = true
                if (that.allPageCompleted === true) {
                    return false;
                }
                if (that.onScrollCompleted === true) {
                    return false;
                }
                that.onScrollCompleted = true;
                setTimeout(() => {
                    that.currentPageCompleted++;
                    that.$post('/sharePlatform-person/personnel/queryCompletedList', {
                        companyId: localStorage.getItem('companyId'),
                        currentPage: that.currentPageCompleted,
                        pageSize: '5'
                    }).then(res => {
                        that.loadingimg = false;

                        if (res.code === 'W3-01-0001') {
                            that.$toast('登录状态已失效');
                            that.$router.push('/')
                        }
                        that.completedList = that.completedList.concat(res.data.list)
                        that.completedLoading = false;
                        if (that.completedList.length == 0) {
                            if(that.currentPageCompleted>1){
                                that.noData = false
                            }else{
                                that.noData = true
                            }
                            that.completedLoading = true
                        } else {
                            that.noData = false
                        }

                        if (res.data.list.length < 5) {
                            that.allPageCompleted = true;
                            that.completedLoading = true;
                        }
                        that.onScrollCompleted = false;
                    })
                }, 300)
            },
            look(item, value) {
                let that = this;
                if (value == 1) {
                    that.looks = JSON.stringify(item.otherPushOrderId.split(','))
                    that.myPushNum = item.myPushNum
                    sessionStorage.setItem('otherPushNum',item.otherPushNum)
                } else {
                    that.looks = JSON.stringify(item.myPushOrderId.split(','))
                    that.otherPushNum = item.otherPushNum;
                }

                that.$post('/sharePlatform-person/personnel/myWaitOrderList', {
                    json: that.looks
                }).then(res => {
                    if (res.code === 'W3-01-0001') {
                        that.$toast('登录状态已失效');
                        that.$router.push('/')
                    } else if (res.code === 'I1-00-9999') {
                        if (!res.data.data) {
                            this.$toast(res.data.msg);
                        } else {
                            sessionStorage.setItem('dataList', JSON.stringify(res.data.data))
                            console.log(that.myPushNum)
                            console.log(that.otherPushNum)
                            this.$router.push({
                                path: '/index/pushOrderList',
                                query: {
                                    value: value,
                                    personnelId: item.personnelId
                                }
                            })
                        }
                    }

                })
            },
            /*修改信息*/
            updateOrder(item) {
                let obj = Object.assign({}, this.$route.query, {type: 2, personnelId: item.personnelId})
                sessionStorage.clear()
                sessionStorage.setItem('obj', JSON.stringify(obj))
                this.$router.push('/index/servicerManagerment/editServicer?personnelId=' + item.personnelId)
            },
            //放入捞人公海池
            removeTosea(item) {
                this.feeMoney = ''
                this.currentItem = item
                this.Feeshow = true
            },
            //从捞人公海池收回
            backOrder(item) {
                moveFromBroadOcean({
                    personnelId: item.personnelId
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('收回成功');
                        this.userList = [];
                        this.currentPage = 0;
                        this.allPage = false;
                        this.onScroll = false;
                        this.loadMore();
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
            confirmFee() {
                if (!this.feeMoney) {
                    this.$toast('请填写佣金')
                    return false;
                }
                var payReg = /^\d+(\.\d{1,2})?$/
                if (!payReg.test(this.feeMoney)) {
                    this.$toast('佣金必须为正数')
                    return false;
                }
                moveToBroadOceanService({
                    personnelId: this.currentItem.personnelId,
                    feeMoney: this.feeMoney
                }).then(res => {
                    if (res.data.code == 'I1-00-001') {
                        this.$toast('操作成功');
                        this.userList = [];
                        this.currentPage = 0;
                        this.allPage = false;
                        this.onScroll = false;
                        this.loadMore();
                    } else {
                        this.$toast(res.data.msg);
                    }
                })
            },
        },
        mounted() {
            //this.loadMore();
            let that = this;
            pushHistory()
            that.gotoURL(function () {
                pushHistory()
                let obj = JSON.parse(sessionStorage.getItem('obj'))
                that.$router.push('/index');
            })
        },
        data() {
            return {
                looks: '',
                currentPage: 0,
                currentPageRight: 0,
                currentPageContract: 0,
                currentPageCompleted: 0,
                currentPagePrePayment: 0,
                userList: [],
                rightList: [],
                completedList: [],
                contractList: [],
                prePaymentList: [],
                loading: false,
                rightLoading: false,
                completedLoading: false,
                contractLoading: false,
                prePaymentLoading: false,
                allPage: false,
                onScroll: false,
                allPageRight: false,
                onScrollRight: false,
                allPageCompleted: false,
                onScrollCompleted: false,
                allPageContract: false,
                onScrollContract: false,
                allPagePrePayment: false,
                onScrollPrePayment: false,
                loadingimg: true,
                loadingimgBottom: false,
                Feeshow: false,
                feeMoney: '',
                currentItem: {},
                btnState: {},
                noData: false,
                active: this.$route.query.active ? this.$route.query.active : '',
                orderStatus: this.$route.query.orderStatus ? this.$route.query.orderStatus : '',
                searchVal: '',
                searchState: true,
                myPushOrderId: '',
                myPushNum: '',
                otherPushNum: '',
                tatus: '',
            }
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .g-list {
        padding: 0 px2rem(15px);
        padding-bottom: 8rem;
        .item {
            width: 100%;
            min-height: 8.875rem;
            height: max-content;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 7px 20px 0px rgba(0, 0, 0, 0.08);
            border-radius: 6px;
            margin-bottom: 1rem;
            margin-top: 1rem;
            border: 1px solid #ddd;
            padding-bottom: 0.5rem;
            position: relative;
            img {
                width: 4rem;
                height: 4rem;
                border-radius: 50%;
                position: absolute;
                right: 1rem;
                top: 0.5rem;
            }
            .part {
                padding: 0 px2rem(15px);
                margin-top: px2rem(15px);
                display: flex;
                button {
                    margin: 0.3rem 0;
                }

                span {
                    display: inline-block;
                }
                .u-text-title {
                    font-weight: bold;
                    font-size: px2rem(16px);
                }
                .u-text-des {
                    font-size: px2rem(16px);
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
                    margin-right: px2rem(10px);
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

    .loading {
        padding-top: 6rem;

        div {
            margin: 0 auto;
        }
    }

    .edit {
        border: none;
        background: rgba(0, 183, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .tosea {
        border: none;
        background: rgba(2, 238, 107, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .reback {
        border: none;
        background: rgba(238, 225, 87, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .watchingPool {
        border: none;
        background: rgba(115, 68, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }

    .van-dialog {
        .van-dialog__content {
            text-align: center;

            input {
                border: none;
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
