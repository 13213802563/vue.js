<template>
    <div>
        <mt-header title="推送服务人员" style="z-index: 999;">
            <router-link to="/index/viewPublicOrders" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<router-link to="/index/customerManagerment/addCustomer" slot="right">-->
                <!--<mt-button>新增</mt-button>-->
            <!--</router-link>-->
            <!--<mt-button icon="more" slot="right"></mt-button>-->
        </mt-header>
        <div class="tab" v-show="!loadingimg">
            <section class="g-list" v-if="customerList.length > 0"  v-infinite-scroll="getList" infinite-scroll-disabled="loading" infinite-scroll-distance="50">
                <div class="item" v-for="(item, index) in customerList" :key="index">
                    <div class="part">
                        <span class="u-text-title">姓名：</span>
                        <span class="u-text-des">{{item.userName}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">性别：</span>
                        <span class="u-text-des">{{item.sexStr}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">管家手机：</span>
                        <span class="u-text-des">{{item.mobile}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">身份证号：</span>
                        <span class="u-text-des">{{item.idCardNum}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">年龄：</span>
                        <span class="u-text-des" v-show="item.age !== 0">{{item.age}}</span>
                    </div>
                    <div class="part" style="position: relative">
                        <span class="u-text-title">工种：</span>
                        <span class="u-text-des">{{item.workerName }}</span>
                    </div>
                    <div class="part" style="position: relative">
                        <span class="u-text-title">工作城市：</span>
                        <span>{{item.serviceCityStr}}</span>
                    </div>
                    <!--<div class="part" style="display: flex;">-->
                        <!--<span class="u-text-title" style="min-width: 5rem;">详细地址：</span>-->
                        <!--<span class="u-text-des">{{item.address}}</span>-->
                    <!--</div>-->
                    <!--<div class="part" style="text-align: left;">-->
                        <!--<button class="edit" @click.stop="updateCustomer(item)">修改客户信息</button>-->
                    <!--</div>-->
                    <div class="part" style="text-align: left;">
                        <button class="edit" @click.stop="toDetail(item)">查看</button>
                    </div>
                    <div class="part" style="text-align: right;" >
                        <label>
                            <input v-if="(item.workerName).search(orderTypeName)!==-1" type="checkbox" :name="item.customerId" :value="item"  v-model="isChecked">
                        </label>
                    </div>
                    <div class="part" style="text-align: right;">
                        <label v-if="(item.workerName).search(orderTypeName)===-1">
                            <span class="orderType">(订单类型与服务人员工种不一致)&nbsp;&nbsp; </span><input type="checkbox" :name="item.customerId" :value="item"  v-model="isChecked" disabled>
                        </label>
                    </div>
                </div>

                <div>
                    <button class="mergeOrderBtn" @click="mergeOrderBtn">确认</button>
                </div>
            </section>
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa" />
        </section>

        <section v-if="loadingimgBottom">
            <div class="dataLoading" >加载中...</div>
        </section>
    </div>
</template>

<script>
    import { queryCustomer } from '@/api/order.js';
    import { Loading,Checkbox } from 'vant';
    export default {
        name: "mergeOrderManagerment",
        data () {
            return {
                customerList: [],
                loading: false,
                currentPage: 0,
                pageSize: 5,
                loadingimg: false,
                checked:false,
                isChecked:[],
                mergeOrderId:'',
                orderTypeName:'',
                allPage:false,
                onScroll:false,
                loadingimgBottom:true
            }
        },
        components: {
            [Loading.name]: Loading
        },
        mounted () {
            this.getList()
            this.orderTypeName = this.$route.query.orderTypeName
        },

        methods: {
            getList () {
                let that = this;
                that.loading = true
                if (that.allPage === true) {
                    return false;
                }
                if (that.onScroll === true) {
                    return false;
                }
                that.loadingimgBottom= true;
                that.onScroll = true;
                setTimeout(() => {
                    that.currentPage++;
                    that.$postwc('/sharePlatform-order/orderCombine/personUncombinedList',{
                    // that.$postwc('/sharePlatform-person/personnel/queryPersonnel',{
                        currentPage:that.currentPage,
                        pageSize:5,
                        companyId:localStorage.getItem('companyId')
                    }).then(res => {
                        this.loadingimg = false;
                        if (res.code === 'I1-00-001') {
                            if (res.data === null) {
                                that.allPage = true
                                that.onScroll = true
                                return false
                            }
                            that.customerList = that.customerList.concat(res.data)
                            this.loading = false;
                            if (res.data.length < 5) {
                                that.allPage = false;
                                that.onScroll = true;
                            } else{
                                that.onScroll = false;
                            }
                        }
                        that.loadingimgBottom = false
                    })
                }, 300)
            },

            // 跳转详情页
            toDetail (item) {
                this.$router.push({
                    name: 'servicerDetails',
                    query: {
                        personnelId: item.personnelId,
                        url: '/index/mergeOrderManagerment',
                        orderTypeName:this.orderTypeName,
                        orderId:this.$route.query.orderId,
                        type:'4'
                    }
                })
            },
            // 跳转修改客户信息
            // updateCustomer (item) {
            //     this.$router.push({
            //         name: 'updateCustomer',
            //         query: {
            //             customerId: item.customerId
            //         }
            //     })
            // },

            //我要合单
            mergeOrderBtn(){
                let arr = [];
                let that = this.isChecked;
                for(let i = 0; i<that.length;i++) {
                    let obj = {};
                    obj["confirmBy"] = this.$route.query.confirmBy;
                    obj["serverPersonId"] = that[i].personnelId;
                    obj["orderId"] = this.$route.query.orderId
                    arr.push(obj);
                }
                if(this.isChecked.length === 0){
                    this.$toast('请勾选需要推送的服务人员');
                    return false;
                }
                this.$postwc('/sharePlatform-order/orderCombine/pushOrderCombine',
                    JSON.stringify(arr)
                ).then(res => {
                    if(res.code === 'I1-00-001'){
                       this.$toast('推送成功，您可在服务人员系统-待合单中查看推送记录');
                        this.$router.push({
                            name: 'viewPublicOrders',
                            query: {
                                val: 1
                            }
                        })
                    }else{
                        this.$toast(res.msg);
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
    .dataLoading{
        position: fixed;
        bottom: 3rem;
        display: flex;
        justify-content: center;
        z-index: 21;
        left: 40%;
    }
    .orderType{
        text-align: left;
        display: inline;
        font-size: 0.7rem;
        color: rgb(38, 162, 255);
        position: relative;
        bottom: 0.2rem;
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
</style>
