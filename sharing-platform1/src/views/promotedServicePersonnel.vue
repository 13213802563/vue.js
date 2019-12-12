<template>
    <div>
        <mt-header title="已推送服务人员" style="z-index: 999;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
            <!--<router-link to="/index/customerManagerment/addCustomer" slot="right">-->
                <!--<mt-button>新增</mt-button>-->
            <!--</router-link>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="tab" v-show="!loadingimg">
            <section class="g-list" v-if="customerList.length > 0">
<!--                v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="50"-->
                <div class="item" v-for="(item, index) in customerList" :key="index">
                    <!--@click.stop="toDetail(item)-->
                    <div class="part">
                        <span class="u-text-title">姓名：</span>
                        <span class="u-text-des">{{item.userName}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">性别：</span>
                        <span class="u-text-des">{{item.sexStr}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">管家电话：</span>
                        <span class="u-text-des">{{item.mobile}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">公司名称：</span>
                        <span class="u-text-des">{{item.companyName}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">年龄：</span>
                        <span class="u-text-des" v-show="item.age !== 0">{{item.age}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">工种：</span>
                        <span class="u-text-des">{{item.workerName}}</span>
                    </div>
                    <div class="part" style="position: relative">
                        <span class="u-text-title">工作城市：</span>
                        <span>{{item.serviceCityStr}}</span>
                    </div>
                    <!--<div class="part" style="text-align: left;">-->
                        <!--<button class="edit" @click.stop="updateCustomer(item)">修改客户信息</button>-->
                    <!--</div>-->
                    <div class="part" style="text-align: left;">
                        <button class="edit" @click.stop="toDetail(item)">查看</button>
                        <button v-if="type === 'order'" class="edit" @click.stop="cancel(item)">撤销</button>
                    </div>
                    <div class="part" style="text-align: right;">
                        <label>
                            <input v-if="type === 'person' " type="radio" :name="item.customerId" :value="item"  v-model="isChecked">
                        </label>
                    </div>
                </div>
                <div>
                    <button v-if="type === 'person'" class="mergeOrderBtn" @click="confirmMerge">确认</button>
                </div>
            </section>
            <div class="no-list" v-else>
                <img src="../assets/no-data.png" alt="">
            </div>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" />
        </section>
    </div>
</template>

<script>
    import { queryCustomer } from '@/api/order.js';
    import {Dialog} from 'vant';
    import { Loading,Checkbox,Radio  } from 'vant';
    export default {
        name: "promotedServicePersonnel",
        data () {
            return {
                customerList: [],
                loading: false,
                currentPage: 0,
                pageSize: 5,
                firstPage: false,
                lastPage: false,
                loadingimg: true,
                isChecked:[],

                allPage: false,
                onScroll: false,
                searchName:'',
                approvalStatus:0,
                reason:"",
                isBtns:false,
                loginId:0,
                orderPersonMap:{},
                countInfoMap:{},
                type:'',
                orderId:'',
                requestType:this.$route.query.type
            }
        },
        components: {
            [Loading.name]: Loading
        },
        created () {
            this.type = sessionStorage.getItem('type')
            this.orderId = sessionStorage.getItem('orderId')
            this.loadingimg = false
            this.$postwc('/sharePlatform-order/orderCombine/orderCombineDetail', {
                type:this.type,
                orderId:this.orderId
            }).then(res => {
                    this.customerList = this.customerList.concat(res.data);
            })
        },

        methods: {
            //确认合并
            confirmMerge(){
                if(this.isChecked == null){
                    this.$toast('请选择服务人员')
                    return false
                }else {
                    this.$postwc('/sharePlatform-order/orderCombine/confirmOrderCombine',{
                        orderId:this.$route.query.orderId,
                        serverPersonId:this.isChecked.personnelId,
                        startBy:this.isChecked.createBy,
                        confirmStatus:1
                    }).then(res => {
                        if(res.code === 'I1-00-001'){
                            let orderSignedId=res.data
                            console.log(orderSignedId)
                            // this.$toast('合单成功');
                            Dialog.alert({
                                title: '合单成功',
                                message: '请于三天内完成合同确认及缴费' +
                                    '(三天内客户未完成缴费则本合单失效)',
                                confirmButtonText:'创建合同'
                            }).then(() => {
                                this.$postwc('/sharePlatform-order/auth/guest/queryCompanyIsPerfect',
                                    localStorage.getItem('companyId')
                                    // 'platform':'sharePlatform-weixin',
                                    // 'jzpt-token':localStorage.getItem('token')? localStorage.getItem('token'):'',
                                    // "queryIsPerfect":item.orderContractId
                                ).then(res => {
                                    if (res.data.isPerfect === 1) {
                                        this.$router.push({
                                            name: 'completeContract',
                                            query: {
                                                val: 2,
                                                orderSignedId:orderSignedId,
                                                orderContractId:'',
                                                type:'edit',
                                                isView:false,
                                                text:'新增合同'
                                            }
                                        })
                                    }else{
                                        this.$toast(res.data.msg)
                                    }
                                })
                            });
                        }else{
                            this.$toast(res.msg);
                        }
                    })
                }
            },

            //撤销
            cancel(item){
                Dialog.confirm({
                    title: '',
                    message: '是否撤销？',
                    confirmButtonText:'确定'
                }).then(() => {
                    this.$postwc('/sharePlatform-order/orderCombine/deleteOrderCombine', {
                        orderId:this.orderId,
                        serverPersonId:item.personnelId
                    }).then(res => {
                        this.loadingimg = false;
                        if (res.code === 'I1-00-001') {
                            this.$toast('撤销成功');
                            this.allPage = false
                            this.onScroll = false
                            this.customerList=[]
                            this.getList()
                        }else{
                            this.$toast(res.msg)
                        }
                    })
                }).catch(() => {

                });
            },

            //返回
            goBack(){
                this.$router.push({
                    name: 'orderManagerment',
                    query: {
                        val: 1
                    }
                })
            },

            // 获取客户列表
            // getList () {
            //     let that = this;
            //     that.loading = true
            //     if (that.allPage === true) {
            //         return false;
            //     }
            //     if (that.onScroll === true) {
            //         return false;
            //     }
            //     that.onScroll = true;
            //     // let orderId = this.$route.query.orderId;
            //     // let type = this.$route.query.type;
            //     setTimeout(() => {
            //         // that.currentPage++;
            //         that.$postwc('/sharePlatform-order/orderCombine/orderCombineDetail', {
            //             // pageNum: that.currentPage,
            //             // pageSize: 5,
            //             type:this.type,
            //             orderId:this.orderId
            //         }).then(res => {
            //             this.loadingimg = false;
            //             if (res.code === 'I1-00-001') {
            //                 if (res.data === null) {
            //                     that.allPage = true
            //                     that.noData = true;
            //                     return false
            //                 }
            //                 that.customerList = that.customerList.concat(res.data);
            //                 that.loading = false;
            //                 if (res.data.length < 5) {
            //                     that.allPage = false;
            //                 }else{
            //                     that.onScroll = false;
            //                     return false
            //                 }
            //             }
            //         })
            //     }, 300)
            // },

            // 跳转详情页
            toDetail (item) {
                this.$router.push({
                    name: 'servicerDetails',
                    query: {
                        personnelId: item.personnelId,
                        //url: '/index/orderManagerment/promotedServicePersonnel',
                        orderType:'order',
                        type:'4'

                    }
                })
            },
            // 跳转修改客户信息
            updateCustomer (item) {
                this.$router.push({
                    name: 'updateCustomer',
                    query: {
                        customerId: item.customerId
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @function px2rem($px) {
        @return $px / 16px * 1rem
    }
    .checkItem {
        background: rgba(238, 115, 165, 0.41);
        font-size: 0.875rem;
        font-weight: bold;
        color: #fff;
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
        padding-top: 2.2rem;
        .g-list {
            padding: 0 px2rem(15px) px2rem(45px);
            margin-bottom:px2rem(26px);
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
                        word-break:break-all;
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
                            background: #c89efc;
                            font-size: px2rem(14px);
                            font-weight: bold;
                            color: #000;
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
                        margin-right: px2rem(10px);
                    }
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
        border:none;
        background: rgba(0, 183, 238, 0.41);
        height: 2rem;
        padding: 0 0.5rem;
    }
    .mergeOrderBtn{
        width: 100%;
        height: 2.6rem;
        border: none;
        background: #26a2ff;
        color: #fff;
        font-weight: bold;
        outline: none;
        margin-top: 1rem;
        position: fixed;
        bottom:0;
        left:0;
        right: 0;
    }
    .mergeOrderBtn{
        width: 100%;
        height: 2.5rem;
        border: none;
        background: #26a2ff;
        color: #fff;
        font-weight: bold;
        outline: none;
        margin-top: 1rem;
        position: fixed;
        bottom:0;
        left:0;
        right: 0;
    }
</style>
