<template>
    <div>
        <mt-header :title="this.$route.query.text" style="    position: fixed;width: 100%;z-index: 999;top: 0;">
            <mt-button icon="back" @click="goBack" slot="left">返回</mt-button>
        </mt-header>
        <div
                style="overflow: scroll; height: 100vh;position: fixed;left: 0;right: 0;">
            <div class="g-list" style="margin-top:3.8rem" v-if="orderlist.length > 0" v-infinite-scroll="viewPool"
                 :infinite-scroll-disabled="loading==true" infinite-scroll-distance="50">
                <!--infinite-scroll-disabled="loading==true" infinite-scroll-distance="50">-->
                <div class="item" v-for="(item, index) in orderlist" :key="index" @click="toDetails(item)">
                    <div class="part">
                        <span class="u-text-title">姓名：</span>
                        <span class="u-text-des">{{item.personName}}</span>
                    </div>
                    <!--<img :src="item.headPic" alt="">-->
                    <!--<img :src=" 'http://erp.95081.com/img/headphoto/2019/10/10/5249bbfce52a4970be46743084106981.png'" alt="">-->

                    <div class="part">
                        <span class="u-text-title">身份证号：</span>
                        <span class="u-text-des">{{item.idCardNum}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">工资状态：</span>
                        <span class="u-text-des">{{item.executeStatusName}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">服务时间：</span>
                        <span class="u-text-des">{{item.startTime+"至"+item.endTime}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">实际出勤天数：</span>
                        <span class="u-text-des">{{item.actualWorkDays+"天"}}</span>
                    </div>
                    <div class="part">
                        <span class="u-text-title">实际应发工资：</span>
                        <span class="u-text-des">{{item.actualSalary+"元"}}</span>
                    </div>
                    <div class="part" v-if="item.consumeCount > 0">
                        <span class="u-text-title">管家手机：</span>
                        <span class="u-text-des" v-html="item.regionMobile == '' ? '--' : item.regionMobile"></span>
                    </div>

                    <div class="part" style="text-align: left;">
                        <button class="edit" v-if="item.personConfirmStatus!=2||item.userConfirmStatus !=2"
                                @click.stop="writeSalary(item)">查看
                        </button>
                        <button class="edit" style="margin-left: 20px;"
                                v-if="item.personConfirmStatus==2||item.userConfirmStatus ==2||item.executeStatus==3"
                                @click.stop="modify(item)">修改
                        </button>
                    </div>
                </div>
            </div>
            <!--<div class="no-list" v-else>-->
            <!--<img src="../assets/no-data.png" alt="">-->
            <!--</div>-->
        </div>
        <div class="no-list" style="margin-top: 12rem;" v-if="noData">
            <img src="../../assets/no-data.png" style="width: 60%;" alt="">
        </div>
        <section class="loading" v-show="loadingimg">
            <van-loading type="spinner" color="#1989fa"/>
        </section>
    </div>
</template>

<script>
    import {InfiniteScroll, Spinner} from 'mint-ui';
    import {Loading} from 'vant';
    import {Dialog} from 'vant';
    // import { getOrderlist, moveToBroadOcean, retrieveOrderFromPool } from '@/api/order.js';
    export default {
        name: "addAlreadySalary",
        data() {
            return {
                orderlist: [],
                loadingimg: true,
                buttonShow: false,
                loading: false,
                noData: false,
                allPage: false,
                onScroll: false,
                currentPage: 0,
            }
        },
        methods: {
            updateSalary() {

            },
            viewPool() {
                let that = this;
                that.currentPage++;
                that.$postwc('/sharePlatform-order/salary/querySalaryRecordList', {
                    orderContractId: that.$route.query.orderContractId, // 合同
                    orderNo: that.$route.query.orderId,    //订单编号pageNum
                    currentPage: that.currentPage,
                    pageSize: '5',

                }).then(res => {
                    that.loadingimg = false;
                    if (res.code == 'I1-00-001') {  //通过
                        that.orderlist = that.orderlist.concat(res.data.list);
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
                    } else if (res.code == 'W2-00-001') {   //执行
                        that.noData = true
                    } else {
                        this.$toast(res.msg);
                    }


                })
            },
            /*修改*/
            modify(item) {
                this.$router.push({
                    name: 'modifyWriteSalary',
                    query: {
                        text: '查看工资',
                        salaryRecordId: item.salaryRecordId,
                        orderContractId: this.$route.query.orderContractId,
                        orderSignedId: this.$route.query.orderSignedId,
                        orderId: this.$route.query.orderId,
                        type: 'view',
                        status: 'finish',
                        userMobile: item.userMobile
                    }
                })
            },
            writeSalary(item) {
                //查看工资
                this.$router.push({
                    name: 'lookSalary',
                    query: {
                        orderContractId: this.$route.query.orderContractId,
                        orderSignedId: this.$route.query.orderSignedId,
                        orderId: this.$route.query.orderId,
                        type: 'view',
                        status: status,
                        text: '查看工资',
                        salaryRecordId: item.salaryRecordId
                    }
                })
            },
            goBack() {
                if (this.$route.query.status == 'finish') {
                    this.$router.push({
                        name: 'orderManagerment',
                        query: {
                            val: 2
                        }
                    })
                }
            }
        },
        mounted() {
           this.viewPool()

        }

    }
</script>

<style scoped lang="scss">
    .no-list {
        padding: px2rem(65px) px2rem(15px) 0;
        text-align: center;
        font-size: px2rem(15px);

        img {
            width: px2rem(260px)!important;
        }
    }
    .g-list {
        padding: 0 px2rem(15px);
        /*padding-bottom: 7rem;*/

        .item {
            width: 90%;
            margin: auto;
            min-height: 10.875rem;
            height: max-content;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 7px 20px 0px rgba(0, 0, 0, 0.08);
            border-radius: 6px;
            margin-bottom: 1rem;
            margin-top: 1rem;
            border: 1px solid #ddd;
            padding: 0.8rem 0;

            img {
                width: 4rem;
                height: 4rem;
                border-radius: 50%;
                position: absolute;
                right: 1rem;
            }

            .part {
                padding: 0 px2rem(15px);
                margin-top: px2rem(15px);
                display: flex;
                height: 2rem;
                margin-left: 0.8rem;

                button {
                    margin: px2rem(20px);
                    background-color: #26a2ff;
                    width: 20%;
                    border: 0 !important;
                    color: #fff;
                    border-radius: 3px;
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
                    color: blue;

                    button {
                        border: none;
                        height: px2rem(25px);
                        padding: 0 px2rem(3px);

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
                    /*background-color:#26a2f;*/
                }
            }

        }
    }



    .loading {
        padding-top: 6rem;

        div {
            margin: 0 auto;
        }
    }
</style>
